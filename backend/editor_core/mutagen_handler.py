from email.mime import audio
import os
import mutagen
import traceback
import re
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TPE1, TPE2, TALB, TRCK, TDRC, TYER, TCON, TPOS
from mutagen.mp4 import MP4, MP4Cover
from mutagen.oggvorbis import OggVorbis
from mutagen.asf import ASF, ASFUnicodeAttribute, ASFByteArrayAttribute
from mutagen.flac import FLAC
from .mappings import AUDIO_TAG_MAPPING, EXT_TO_TYPE, TAG_SYS_MAP
from .user_error import UserError

# PATTERN FOR CHECKING VALID TRACK/DISC NUMBER INPUTS
TRCK_DISC_PATTERN = r"^\d+(/\d+)?$"

# MUTAGEN HANDLER FOR AUDIO FILE TAGGING
class MutagenHandler:
    def __init__(self, audio_src):
        self.audio_src = audio_src

    def read_metadata(self):
        result = {}
        audio_file = mutagen.File(self.audio_src)

        if not audio_file:
            raise UserError(f"Could not open file {self.audio_src}")

        ext = os.path.splitext(self.audio_src)[1].lower()

        file_type = EXT_TO_TYPE[ext]
        tag_sys_name = TAG_SYS_MAP[file_type]

        # get the appropriate metadata tag mapping for a specific file type
        tag_map = AUDIO_TAG_MAPPING[file_type]

        # get audio stream information (bitrate, sample rate, audio channel count etc.)
        # exists in every audio file type
        result = {
            "tag_sys": tag_sys_name,
            "format": file_type,
            "duration": round(audio_file.info.length, 2),
            "bitrate":  getattr(audio_file.info, "bitrate", None), # "audio_file.info" for basic audio stream info
            "channels": getattr(audio_file.info, "channels", None),
            "sample_rate": getattr(audio_file.info, "sample_rate", None),
            "tags": {}
        }

        # check if there are no tags in the file
        if audio_file.tags is None: # "audio_file.tags" for user-defined metadata tags
            return result
        
        for name, key in tag_map.items():
            # skip unsupported keys 
            # some tagging systems do not have certain tags 
            # that might be available in other systems
            if key is None:
                continue

            if name == "cover_art":
                continue

            result["tags"][name] = self._get_field(audio_file.tags, file_type, name, key)
        
        return result

    def _get_field(self, tags, fmt, field_name, raw_key):
        id3_types = ["mp3", "aiff", "wav"]
        vorbis_types = ["flac", "ogg"]
        mp4_types = ["mp4"]
        asf_exts = ["wma"]
        
        if fmt in id3_types:
            # todo id3 tag reading
            return self._get_id3_field(tags, fmt, raw_key)
        
        elif fmt in vorbis_types:
            # todo vorbis tag reading
            return self._get_vorbis_field(tags, fmt, raw_key)

        elif fmt in mp4_types:
            # todo mp4 tag reading
            return self._get_mp4_field(tags, fmt, raw_key)

        elif fmt in asf_exts:
            # todo asf tag reading
            return self._get_asf_field(tags, fmt, raw_key)
        
        return None

    
    '''
    GETTER methods for each tagging system.
    '''
    def _get_id3_field(self, tags, fmt, raw_key):
        # for text-based tags, they are always stored in a list for consistency, 
        # even if they only store 1 value most of the time in most audio files
        # print(raw_key)

        # multiple COMM, USLT and APIC frames can exist in a single file, 
        # each with a different language and description.
        # e.g. COMM:eng, COMM:jp, USLT:jp, APIC:cover, APIC:icon etc.
        tag = None

        if raw_key in ["COMM", "USLT", "APIC"]:
            # find the first frame that starts with a special key like COMM, USLT or APIC
            for key in tags.keys():
                if key.startswith(raw_key):
                    tag = tags.get(key, None)
                    break
        else:          
            tag = tags.get(raw_key, None) # only raw text frames

        if tag is None: return None

        ## COMM - comments, USLT - song lyrics, APIC - album art 
        # COMM - has encoding byte, language, short description (in encoding) + actual comment content (in encoding)
        # USLT - same structure as COMM
        # APIC - has encoding byte, MIME type of image + picture type (whether image serves as a front cover or icon) + short description
        # + short description (in encoding) + actual image contents
        is_comment = raw_key.startswith("COMM")
        is_lyrics = raw_key.startswith("USLT")
        is_cover_art = raw_key.startswith("APIC")

        # print(is_comment, is_lyrics, is_cover_art, is_track_no, is_disc_no)
        if is_comment:
            return {
                "lang": tag.lang,
                "desc": tag.desc,
                "text": tag.text[0]
            }
        
        if is_lyrics:
            return {
                "lang": tag.lang,
                "desc": tag.desc,
                "text": tag.text[0]
            }

        # for text metadata
        # they have an encoding type (UTF-8, ASCII) + the actual text contents stored in binary
        tag_val = tag.text[0]

        # getting release years
        # ID3v2.4 - uses TDRC for date and time combined. in mutagen, it returns a TDRC object.
        # make sure to only parse the year using the "year" property to only get the recording year of the file.
        if raw_key == "TDRC":
            if tag and tag.text:
                return str(tag.text[0].year)
            
        # ID3v2.3 - uses TYER to get the year value.
        if raw_key == "TYER":
            if tag and tag.text:
                return str(tag.text[0])

        return tag_val


    def _get_vorbis_field(self, tags, fmt, raw_key):
        # note with vorbis fields
        # multiple values can be mapped to the same vorbis field
        # in mutagen, each key would store these values in a list, even if there is only 1 value for that key
        field = tags.get(raw_key, None)
        
        return field[0] if field else None


    def _get_mp4_field(self, tags, fmt, raw_key):
        field = tags.get(raw_key, None)
        val = field[0] if field else None

        # check if the field is a track number or disc number
        if isinstance(val, tuple):
            if raw_key == AUDIO_TAG_MAPPING["mp4"]["track_number"]:
                track_number = val[0]
                total_tracks = val[1]
                return f"{track_number}/{total_tracks}"
            
            if raw_key == AUDIO_TAG_MAPPING["mp4"]["disc_number"]:
                disc_number = val[0]
                total_discs = val[1]
                return f"{disc_number}/{total_discs}"

        return val 

    def _get_asf_field(self, tags, fmt, raw_key):
        tag = tags.get(raw_key, None)
        val = tag[0] if tag else None

        val_str = val.value if val else None
        
        return val_str


    def set_metadata(self, new_tags):
        result = {}
        audio_file = mutagen.File(self.audio_src)

        if not audio_file:
            raise UserError(f"Could not open file {self.audio_src}")

        ext = os.path.splitext(self.audio_src)[1].lower()

        file_type = EXT_TO_TYPE[ext]

        self._set_fields(audio_file, new_tags, file_type)

        return "Changes successfully saved"


    def _set_fields(self, file, new_tags, fmt):
        id3_types = ["mp3", "aiff", "wav"]
        vorbis_types = ["flac", "ogg"]
        mp4_types = ["mp4"]
        asf_exts = ["wma"]
        
        if fmt in id3_types:
            # todo id3 tag setting
            return self._set_id3_fields(file, new_tags)
        
        elif fmt in vorbis_types:
            # todo vorbis tag setting
            return self._set_vorbis_fields(file, new_tags)

        elif fmt in mp4_types:
            # todo mp4 tag setting
            return self._set_mp4_fields(file, new_tags)

        elif fmt in asf_exts:
            # todo asf tag setting
            return self._set_asf_fields(file, new_tags)
        
        return None

    '''
    SETTER methods for each tagging system.
    '''
    def _set_id3_fields(self, file, new_tags):
        # check if there is an existing ID3 header tag in the file, if not create a new one
        try:
            audio_id3 = ID3(self.audio_src)
        except ID3NoHeaderError:
            audio_id3 = ID3()

        # get current id3 version before writing to the file
        ver_major, ver_minor, asdf = audio_id3.version

        for key, val in new_tags.items():
            if key == "title":
                audio_id3["TIT2"] = TIT2(encoding=3, text=[val])

            elif key == "album_artist":
                audio_id3["TPE2"] = TPE2(encoding=3, text=[val])

            elif key == "artist":
                audio_id3["TPE1"] = TPE1(encoding=3, text=[val])

            elif key == "album":
                audio_id3["TALB"] = TALB(encoding=3, text=[val])
                
            elif key == "year": # write to TDRC or TYER depending on the file's ID3 version
                if ver_minor == 4: audio_id3["TDRC"] = TDRC(encoding=3, text=[val])
                elif ver_minor == 3: audio_id3["TYER"] = TYER(encoding=3, text=[val])

            elif key == "genre":
                audio_id3["TCON"] = TCON(encoding=3, text=[val])

            elif key == "track_number":
                if not re.search(TRCK_DISC_PATTERN, val):
                    raise UserError("Invalid track number format. It must be a number, or in the format: <track number>/<total tracks>")
                audio_id3["TRCK"] = TRCK(encoding=3, text=[str(val)])

            elif key == "disc_number":
                if not re.search(TRCK_DISC_PATTERN, val):
                    raise UserError("Invalid disc number format. It must be a number, or in the format: <disc number>/<total discs>")
                audio_id3["TPOS"] = TPOS(encoding=3, text=[str(val)])

        audio_id3.save(self.audio_src)

    def _set_vorbis_fields(self, file, new_tags):
        audio_vorbis = OggVorbis(self.audio_src)

        if audio_vorbis.tags is None:
            audio_vorbis.add_tags()

        for key, val in new_tags.items():
            if key in AUDIO_TAG_MAPPING["ogg"]:
                if key == "track_number":
                    if not re.search(TRCK_DISC_PATTERN, val):
                        raise UserError("Invalid track number format. It must be a number, or in the format: <track number>/<total tracks>")
                    audio_vorbis[AUDIO_TAG_MAPPING["ogg"][key]] = [val]
                    continue
                elif key == "disc_number":
                    if not re.search(TRCK_DISC_PATTERN, val):
                        raise UserError("Invalid disc number format. It must be a number, or in the format: <disc number>/<total discs>")
                    audio_vorbis[AUDIO_TAG_MAPPING["ogg"][key]] = [val]
                    continue

                audio_vorbis[AUDIO_TAG_MAPPING["ogg"][key]] = [str(val)]
        
        audio_vorbis.save(self.audio_src)
        

    def _set_mp4_fields(self, file, new_tags):
        audio_mp4 = MP4(self.audio_src)

        for key, val in new_tags.items():
            if not key in AUDIO_TAG_MAPPING["mp4"]:
                continue
            
            if key == "track_number" or key == "disc_number":
                if not re.search(TRCK_DISC_PATTERN, val) and key == "track_number":
                    raise UserError("Invalid track number format. It must be a number, or in the format: <track number>/<total tracks>")
                
                if not re.search(TRCK_DISC_PATTERN, val) and key == "disc_number":
                    raise UserError("Invalid disc number format. It must be a number, or in the format: <disc number>/<total discs>")

                # MP4 track/disc numbers are stored as a list of tuples (number, total)
                if "/" in val:
                    number = int(val.split("/")[0])
                    total = int(val.split("/")[1])
                    audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [(number, total)]
                else:
                    audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [(int(val), 0)]
                continue
                
            audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [val]
        
        audio_mp4.save(self.audio_src)

    def _set_asf_fields(self, file, new_tags):
        audio_asf = ASF(self.audio_src)

        if audio_asf.tags is None:
            audio_asf.add_tags()

        for key, val in new_tags.items():
            if key in AUDIO_TAG_MAPPING["wma"]:
                if key == "track_number":
                    if not re.search(TRCK_DISC_PATTERN, val):
                        raise UserError("Invalid track number format. It must be a number, or in the format: <track number>/<total tracks>")
                    audio_asf[AUDIO_TAG_MAPPING["wma"][key]] = [val]
                    continue
                elif key == "disc_number":
                    if not re.search(TRCK_DISC_PATTERN, val):
                        raise UserError("Invalid disc number format. It must be a number, or in the format: <disc number>/<total discs>")
                    audio_asf[AUDIO_TAG_MAPPING["wma"][key]] = [val]
                    continue

                audio_asf[AUDIO_TAG_MAPPING["wma"][key]] = [str(val)]
        
        audio_asf.save(self.audio_src)
    
    def _safe_int(self, value):
        if not value:
            return None
        try:
            return int(value)
        except ValueError:
            return None