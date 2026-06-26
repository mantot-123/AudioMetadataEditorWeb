import struct
import base64
import os
import mutagen
import traceback
from mutagen.id3 import ID3, APIC, ID3NoHeaderError
from mutagen.mp4 import MP4, MP4Cover
from mutagen.asf import ASF, ASFByteArrayAttribute
from .mappings import AUDIO_TAG_MAPPING, EXT_TO_TYPE

class AlbumArtHandler:
    def __init__(self, audio_src):
        self.audio_src = audio_src

    # GETTER methods for cover art
    def get_cover_art(self):
        try:
            ext = os.path.splitext(self.audio_src)[1].lower()

            file_type = EXT_TO_TYPE[ext]

            # get the appropriate metadata tag mapping for a specific file type
            tag_map = AUDIO_TAG_MAPPING[file_type]

            id3_types = ["mp3", "aiff", "wav"]
            vorbis_types = ["flac", "ogg"]
            mp4_types = ["mp4"]
            asf_exts = ["wma"]

            if file_type in id3_types:
                # todo id3 tag reading
                return self._get_id3_art()

            elif file_type in mp4_types:
                # todo mp4 tag reading
                return self._get_mp4_art()

            elif file_type in asf_exts:
                # todo asf tag reading
                return self._get_asf_art()

            else:
                raise Exception("Unsupported audio file type.")

        except Exception as e:
            traceback.print_exc()
            return {"error": str(e)}


    def _get_id3_art(self):
        try:
            audio_id3 = ID3(self.audio_src)
        except ID3NoHeaderError:
            audio_id3 = ID3()
        
        if not audio_id3:
            raise Exception(f"Could not open file {self.audio_src}")

        tag_name = AUDIO_TAG_MAPPING["mp3"]["cover_art"]

        cover = None

        for key in audio_id3:
            if key.startswith(tag_name):
                cover = audio_id3.get(key)
                pass

        if not cover:
            return None
        
        art_data = {
            "mime": cover.mime,
            "art_type": cover.type,
            "desc": cover.desc,
            "img": base64.b64encode(cover.data).decode("utf-8")
        }

        return art_data


    def _get_mp4_art(self):
        audio_mp4 = MP4(self.audio_src)

        if not audio_mp4:
            raise Exception(f"Could not open file {self.audio_src}")

        tag_name = AUDIO_TAG_MAPPING["mp4"]["cover_art"]
        tag = audio_mp4.get(tag_name)

        # COVER ART is stored as a list of MP4Cover objects, which contain the image data and format
        cover = tag[0]

        if not cover:
            return None

        mime = "image/jpeg" if cover.imageformat == MP4Cover.FORMAT_JPEG else "image/png"

        art_data = {
            "mime": mime,
            "art_type": None,
            "desc": None,
            "img": base64.b64encode(cover).decode("utf-8")
        }

        return art_data

    def _get_asf_art(self):
        audio_asf = ASF(self.audio_src)

        if not audio_asf:
            raise Exception(f"Could not open file {self.audio_src}")

        tag_name = AUDIO_TAG_MAPPING["wma"]["cover_art"]
        tag = audio_asf.get(tag_name)

        # print(dict(audio_asf))

        if not tag:
            return None
        
        cover = tag[0]

        art_data = {
            "mime": None,
            "art_type": None,
            "desc": None,
            "img": base64.b64encode(cover.value).decode("utf-8")
        }

        return art_data

    # SETTER methods for cover art
    def set_cover_art(self, data):
        try:
            ext = os.path.splitext(self.audio_src)[1].lower()
            file_type = EXT_TO_TYPE[ext]

            id3_types = ["mp3", "aiff", "wav"]
            mp4_types = ["mp4"]
            asf_exts = ["wma"]

            if file_type in id3_types:
                # todo id3 tag reading
                return self._set_id3_art(data)

            elif file_type in mp4_types:
                # todo mp4 tag reading
                return self._set_mp4_art(data)

            elif file_type in asf_exts:
                # todo asf tag reading
                return self._set_asf_art(data)

            else:
                raise Exception("Unsupported audio file type.")

        except Exception as e:
            traceback.print_exc()
            return {"error": str(e)}

    def _set_id3_art(self, data):
        try:
            audio_id3 = ID3(self.audio_src)
        except ID3NoHeaderError:
            audio_id3 = ID3()
        
        audio_id3.delall("APIC") # clear all existing APIC frames

        audio_id3["APIC:"] = APIC(
            encoding=3, # utf-8 encoding
            mime=data["mime"],
            type=3, # for front cover
            desc="",
            data=data["img"] # insert raw image data 
        )

        # use id3v2.3 so it stays compatible with legacy players
        audio_id3.save(self.audio_src, v2_version=3)


    def _set_mp4_art(self, data):
        audio_mp4 = MP4(self.audio_src)
        
        fmt = MP4Cover.FORMAT_JPEG if data["mime"] in ["image/jpeg", "image/jpg"] else MP4Cover.FORMAT_PNG

        tag_name = AUDIO_TAG_MAPPING["mp4"]["cover_art"]

        audio_mp4[tag_name] = [
            MP4Cover(data["img"], fmt)
        ]

        audio_mp4.save(self.audio_src)
        

    def _set_asf_art(self, data):
        audio_asf = ASF(self.audio_src)

        tag_name = AUDIO_TAG_MAPPING["wma"]["cover_art"]

        mime = data["mime"].encode("utf-16-le")
        description = "".encode("utf-16-le")
        art_type = 3 # for front cover

        # WM/Picture binary structure
        picture = (
            struct.pack("<bi", art_type, len(data["img"])) +
            mime + b"\x00\x00" +
            description + b"\x00\x00" +
            data["img"]
        )

        audio_asf[tag_name] = [ASFByteArrayAttribute(picture)]

        audio_asf.save()