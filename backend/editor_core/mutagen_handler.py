from email.mime import audio
import os
import mutagen
import traceback
from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TPE1, TALB, TRCK, TDRC, TYER, TCON, TPOS
from mutagen.mp4 import MP4, MP4Cover
from mutagen.oggvorbis import OggVorbis
from mutagen.asf import ASF, ASFUnicodeAttribute, ASFByteArrayAttribute
from mutagen.flac import FLAC

# MUTAGEN HANDLER FOR AUDIO FILE TAGGING

# Complete audio tag mapping = thanks for writing this mapping for me, Claude :D
AUDIO_TAG_MAPPING = {
    # -------------------------------------------------------------------------
    # MP3 — ID3v2 frames (raw mutagen.id3 / mutagen.mp3)
    # Use EasyID3 if you want the 'easy' keys instead
    # -------------------------------------------------------------------------
    "mp3": {
        "title":        "TIT2",
        "artist":       "TPE1",
        "album_artist": "TPE2",
        "album":        "TALB",
        "year":         "TDRC",   # ID3v2.4; fallback: TYER (v2.3)
        "track_number": "TRCK",   # often "N/M" e.g. "3/12"
        "disc_number":  "TPOS",   # often "N/M" e.g. "1/2"
        "genre":        "TCON",
        "comment":      "COMM",   # frame has .text and .lang attributes
        "composer":     "TCOM",
        "lyrics":       "USLT",   # unsynchronised lyrics; has .text attribute
        "bpm":          "TBPM",
        "cover_art":    "APIC",   # has .data (bytes) and .mime attributes
        "encoder":      "TSSE",
        "copyright":    "TCOP",
        "isrc":         "TSRC",
        "label":        "TPUB",
    },

    # -------------------------------------------------------------------------
    # FLAC — Vorbis Comments (mutagen.flac)
    # Keys are case-insensitive in the spec but mutagen lowercases them
    # -------------------------------------------------------------------------
    "flac": {
        "title":        "title",
        "artist":       "artist",
        "album_artist": "albumartist",
        "album":        "album",
        "year":         "date",
        "track_number": "tracknumber",
        "disc_number":  "discnumber",
        "genre":        "genre",
        "comment":      "comment",
        "composer":     "composer",
        "lyrics":       "lyrics",
        "bpm":          "bpm",
        "cover_art":    None,      # stored as FLAC picture blocks, not a tag key
        "encoder":      "encoder",
        "copyright":    "copyright",
        "isrc":         "isrc",
        "label":        "organization",
    },

    # -------------------------------------------------------------------------
    # OGG Vorbis — Vorbis Comments (mutagen.oggvorbis)
    # Identical key convention to FLAC
    # -------------------------------------------------------------------------
    "ogg": {
        "title":        "title",
        "artist":       "artist",
        "album_artist": "albumartist",
        "album":        "album",
        "year":         "date",
        "track_number": "tracknumber",
        "disc_number":  "discnumber",
        "genre":        "genre",
        "comment":      "comment",
        "composer":     "composer",
        "lyrics":       "lyrics",
        "bpm":          "bpm",
        "cover_art":    None,      # OGG cover art is non-standard; avoid
        "encoder":      "encoder",
        "copyright":    "copyright",
        "isrc":         "isrc",
        "label":        "organization",
    },

    # -------------------------------------------------------------------------
    # MP4 / AAC / M4A / M4B — iTunes atoms (mutagen.mp4)
    # © prefix is a literal character in the key string
    # -------------------------------------------------------------------------
    "mp4": {
        "title":        "\xa9nam",   # ©nam
        "artist":       "\xa9ART",   # ©ART
        "album_artist": "aART",
        "album":        "\xa9alb",   # ©alb
        "year":         "\xa9day",   # ©day — full date string e.g. "2024-03-15"
        "track_number": "trkn",      # stored as list of (track, total) tuples
        "disc_number":  "disk",      # stored as list of (disc, total) tuples
        "genre":        "\xa9gen",   # ©gen
        "comment":      "\xa9cmt",   # ©cmt
        "composer":     "\xa9wrt",   # ©wrt
        "lyrics":       "\xa9lyr",   # ©lyr
        "bpm":          "tmpo",      # stored as integer
        "cover_art":    "covr",      # list of MP4Cover objects (bytes + format)
        "encoder":      "\xa9too",   # ©too
        "copyright":    "cprt",
        "isrc":         None,        # no standard atom; sometimes in freeform ----
        "label":        None,        # no standard atom
    },

    # -------------------------------------------------------------------------
    # WMA / ASF — ASF attributes (mutagen.asf)
    # Values are ASFValue objects; use .value to extract
    # -------------------------------------------------------------------------
    "wma": {
        "title":        "Title",
        "artist":       "Author",
        "album_artist": "WM/AlbumArtist",
        "album":        "WM/AlbumTitle",
        "year":         "WM/Year",
        "track_number": "WM/TrackNumber",
        "disc_number":  "WM/PartOfSet",
        "genre":        "WM/Genre",
        "comment":      "Description",
        "composer":     "WM/Composer",
        "lyrics":       "WM/Lyrics",
        "bpm":          "WM/BeatsPerMinute",
        "cover_art":    "WM/Picture",  # ASFByteArrayAttribute with raw image data
        "encoder":      "WM/EncodingSettings",
        "copyright":    "Copyright",
        "isrc":         "WM/ISRC",
        "label":        "WM/Publisher",
    },

    # -------------------------------------------------------------------------
    # AIFF — ID3v2 frames embedded in AIFF (mutagen.aiff)
    # Identical frame codes to MP3/ID3; treat the same way
    # -------------------------------------------------------------------------
    "aiff": {
        "title":        "TIT2",
        "artist":       "TPE1",
        "album_artist": "TPE2",
        "album":        "TALB",
        "year":         "TDRC",
        "track_number": "TRCK",
        "disc_number":  "TPOS",
        "genre":        "TCON",
        "comment":      "COMM",
        "composer":     "TCOM",
        "lyrics":       "USLT",
        "bpm":          "TBPM",
        "cover_art":    "APIC",
        "encoder":      "TSSE",
        "copyright":    "TCOP",
        "isrc":         "TSRC",
        "label":        "TPUB",
    },

    # -------------------------------------------------------------------------
    # WAVE — ID3v2 frames embedded in WAVE (mutagen.wave)
    # Same as MP3/AIFF — ID3 frames all the way down
    # -------------------------------------------------------------------------
    "wav": {
        "title":        "TIT2",
        "artist":       "TPE1",
        "album_artist": "TPE2",
        "album":        "TALB",
        "year":         "TDRC",
        "track_number": "TRCK",
        "disc_number":  "TPOS",
        "genre":        "TCON",
        "comment":      "COMM",
        "composer":     "TCOM",
        "lyrics":       "USLT",
        "bpm":          "TBPM",
        "cover_art":    "APIC",
        "encoder":      "TSSE",
        "copyright":    "TCOP",
        "isrc":         "TSRC",
        "label":        "TPUB",
    },
}

# extension to file type mapping
EXT_TO_TYPE = {
    ".mp3":  "mp3",
    ".flac": "flac",
    ".ogg":  "ogg",
    ".oga":  "ogg",
    ".mp4":  "mp4",
    ".m4a":  "mp4",
    ".m4b":  "mp4",
    ".m4p":  "mp4",
    ".wma":  "wma",
    ".asf":  "wma",
    ".aif":  "aiff",
    ".aiff": "aiff",
    ".wav":  "wav",
    ".wave": "wav",
}


class MutagenHandler:
    def __init__(self, audio_src):
        self.audio_src = audio_src

    def read_metadata(self):
        result = {}
        try:
            audio_file = mutagen.File(self.audio_src)

            if not audio_file:
                raise Exception(f"Could not open file {self.audio_src}")

            ext = os.path.splitext(self.audio_src)[1].lower()

            file_type = EXT_TO_TYPE[ext]

            # get the appropriate metadata tag mapping for a specific file type
            tag_map = AUDIO_TAG_MAPPING[file_type]

            # get audio stream information (bitrate, sample rate, audio channel count etc.)
            # exists in every audio file type
            result = {
                "filepath": self.audio_src,
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

                result["tags"][name] = self._get_field(audio_file.tags, file_type, name, key)

        except Exception as e:
            traceback.print_exc()
            return {}
        
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
        print(raw_key)

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
        is_track_no = raw_key.startswith("TRCK")
        is_disc_no = raw_key.startswith("TPOS")

        print(is_comment, is_lyrics, is_cover_art, is_track_no, is_disc_no)
        if is_comment:
            return {
                "lang": tag.lang,
                "desc": tag.desc,
                "text": tag.text[0]
            }
        elif is_lyrics:
            return {
                "lang": tag.lang,
                "desc": tag.desc,
                "text": tag.text[0]
            }
        elif is_cover_art:
            return {
                "mime": tag.mime,
                "art_type": tag.type,
                "desc": tag.desc 
            }
        elif is_track_no:
            return {
                "track_number": tag.text[0].split("/")[0] if "/" in tag.text[0] else tag.text[0],
                "total_tracks": tag.text[0].split("/")[1] if "/" in tag.text[0] else None
            }
        elif is_disc_no:
            return {
                "disc_number": tag.text[0].split("/")[0] if "/" in tag.text[0] else tag.text[0],
                "total_discs": tag.text[0].split("/")[1] if "/" in tag.text[0] else None
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

        # COVER ART is stored as a list of MP4Cover objects, which contain the image data and format
        if raw_key == AUDIO_TAG_MAPPING["mp4"]["cover_art"]:
            if not val: return None
            return {
                "mime": "image/jpeg" if val.imageformat == MP4Cover.FORMAT_JPEG else "image/png", # mp4 album art only supports JPEG and PNG formats
                "art_type": None,  # not supported - mp4 does not have a field for art types and description
                "desc": None 
            }

        # check if the field is a track number or disc number
        if isinstance(val, tuple):
            if raw_key == AUDIO_TAG_MAPPING["mp4"]["track_number"]:
                return {
                    "track_number": val[0],
                    "total_tracks": val[1]
                }
            
            if raw_key == AUDIO_TAG_MAPPING["mp4"]["disc_number"]:
                return {
                    "disc_number": val[0],
                    "total_discs": val[1]
                }

        return val 

    def _get_asf_field(self, tags, fmt, raw_key):
        tag = tags.get(raw_key, None)
        val = tag[0] if tag else None
        
        # WMA cover art
        if raw_key == AUDIO_TAG_MAPPING["wma"]["cover_art"]:
            if not val: return None
            return {
                "mime": val.mime,
                "art_type": val.type,
                "desc": val.description
            }

        val_str = str(val) if val else None
        # WMA track/disc number
        if raw_key == AUDIO_TAG_MAPPING["wma"]["track_number"]:
            return {
                "track_number": int(val_str.split("/")[0]) if "/" in val_str else val_str,
                "total_tracks": int(val_str.split("/")[1]) if "/" in val_str else None
            }
        
        if raw_key == AUDIO_TAG_MAPPING["wma"]["disc_number"]:
            return {
                "disc_number": int(val_str.split("/")[0]) if "/" in val_str else val_str,
                "total_discs": int(val_str.split("/")[1]) if "/" in val_str else None
            }
        
        return val_str


    def set_metadata(self, new_tags):
        result = {}
        try:
            audio_file = mutagen.File(self.audio_src)

            if not audio_file:
                raise Exception(f"Could not open file {self.audio_src}")

            ext = os.path.splitext(self.audio_src)[1].lower()

            file_type = EXT_TO_TYPE[ext]

            self._set_fields(audio_file, new_tags, file_type)

            return {"result": "success"}

        except Exception as e:
            traceback.print_exc()
            return {"result": "error"}
        
        return result


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
                track_no = str(val.get("track_no")) if isinstance(val, dict) else str(val)
                total_tracks = str(val.get("total_tracks")) if isinstance(val, dict) else None
                track_str = f"{track_no}/{total_tracks}" if total_tracks else track_no
                audio_id3["TRCK"] = TRCK(encoding=3, text=[str(track_str)])
                
            elif key == "disc_number":
                disc_no = str(val.get("disc_no")) if isinstance(val, dict) else str(val)
                total_discs = str(val.get("total_discs")) if isinstance(val, dict) else None
                disc_str = f"{disc_no}/{total_discs}" if total_discs else disc_no
                audio_id3["TPOS"] = TPOS(encoding=3, text=[str(disc_str)])

        audio_id3.save(self.audio_src)

    def _set_vorbis_fields(self, file, new_tags):
        audio_vorbis = OggVorbis(self.audio_src)

        if audio_vorbis.tags is None:
            audio_vorbis.add_tags()

        for key, val in new_tags.items():
            if key in AUDIO_TAG_MAPPING["ogg"]:
                if key == "track_number":
                    track_num = str(val.get("track_no")) if isinstance(val, dict) else str(val)
                    total_tracks = str(val.get("total_tracks")) if isinstance(val, dict) else None
                    track_str = f"{track_num}/{total_tracks}" if total_tracks else track_num
                    audio_vorbis[AUDIO_TAG_MAPPING["ogg"][key]] = [track_str]
                    continue
                elif key == "disc_number":
                    disc_num = str(val.get("disc_no")) if isinstance(val, dict) else str(val)
                    total_discs = str(val.get("total_discs")) if isinstance(val, dict) else None
                    disc_str = f"{disc_num}/{total_discs}" if total_discs else disc_num
                    audio_vorbis[AUDIO_TAG_MAPPING["ogg"][key]] = [disc_str]
                    continue

                audio_vorbis[AUDIO_TAG_MAPPING["ogg"][key]] = [str(val)]
        
        audio_vorbis.save(self.audio_src)
        

    def _set_mp4_fields(self, file, new_tags):
        audio_mp4 = MP4(self.audio_src)

        for key, val in new_tags.items():
            if not key in AUDIO_TAG_MAPPING["mp4"]:
                continue
            
            if key == "track_number":
                # MP4 track/disc numbers are stored as a list of tuples (number, total)
                if isinstance(val, dict):
                    number = val.get("track_no")
                    total = val.get("total_tracks")
                    audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [(number, total)]
                else:
                    audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [(val, 0)]
                continue

            if key == "disc_number":
                # MP4 track/disc numbers are stored as a list of tuples (number, total)
                if isinstance(val, dict):
                    number = val.get("disc_no")
                    total = val.get("total_discs")
                    audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [(number, total)]
                else:
                    audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [(val, 0)]      
                continue
                
            audio_mp4[AUDIO_TAG_MAPPING["mp4"][key]] = [val]
        
        audio_mp4.save(self.audio_src)

    def _set_asf_fields(self, file, new_tags):
        audio_asf = ASF(self.audio_src)

        if audio_asf.tags is None:
            audio.add_tags()

        for key, val in new_tags.items():
            if key in AUDIO_TAG_MAPPING["wma"]:
                if key == "track_number":
                    track_num = str(val.get("track_no")) if isinstance(val, dict) else str(val)
                    total_tracks = str(val.get("total_tracks")) if isinstance(val, dict) else None
                    track_str = f"{track_num}/{total_tracks}" if total_tracks else track_num
                    audio_asf[AUDIO_TAG_MAPPING["wma"][key]] = [track_str]
                    continue
                elif key == "disc_number":
                    disc_num = str(val.get("disc_no")) if isinstance(val, dict) else str(val)
                    total_discs = str(val.get("total_discs")) if isinstance(val, dict) else None
                    disc_str = f"{disc_num}/{total_discs}" if total_discs else disc_num
                    audio_asf[AUDIO_TAG_MAPPING["wma"][key]] = [disc_str]
                    continue

                audio_asf[AUDIO_TAG_MAPPING["wma"][key]] = [str(val)]
        
        audio_asf.save(self.audio_src)