import base64
import os
import mutagen
import traceback
from mutagen.id3 import ID3, ID3NoHeaderError
from mutagen.mp4 import MP4, MP4Cover
from mutagen.asf import ASF
from .mappings import AUDIO_TAG_MAPPING, EXT_TO_TYPE

class AlbumArtHandler:
    def __init__(self, audio_src):
        self.audio_src = audio_src

    # GETTER methods for cover art
    def get_cover_art(self):
        result = {}
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
            return {}


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
            "mime": cover.mime,
            "art_type": cover.type,
            "desc": cover.desc,
            "img": base64.b64encode(cover.value).decode("utf-8")
        }

        return art_data


    # setter methods for cover art
    def _set_cover_art(self):
        pass

    def _set_id3_art(self):
        pass

    def _set_mp4_art(self):
        pass

    def _set_asf_art(self):
        pass