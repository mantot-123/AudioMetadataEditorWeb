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


TAG_SYS_MAP = {
    "mp3": "id3",
    "flac": "vorbis",
    "ogg": "vorbis",
    "mp4": "mp4/itunes",
    "wma": "asf",
    "wav": "id3",
    "aiff": "id3",
}