from mappings import AUDIO_TAG_MAPPING, EXT_TO_TYPE
import os
import mutagen
import traceback

class AlbumArtHandler:
    def __init__(self, audio_src):
        self.audio_src = audio_src

    # GETTER methods for cover art
    def _read_cover_art(self):
        pass

    def _read_id3_art(self):
        pass

    def _read_mp4_art(self):
        pass

    def _read_asf_art(self):
        pass

    # setter methods for cover art
    def _set_cover_art(self):
        pass

    def _set_id3_art(self):
        pass

    def _set_mp4_art(self):
        pass

    def _set_asf_art(self):
        pass