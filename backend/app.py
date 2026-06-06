import os
import mimetypes
import mutagen
import traceback
import time
import musicbrainzngs
from flask import Flask, request

from editor_core import (musicbrainz_handler, 
                        mutagen_handler, 
                        settings_handler)

import ssl
import certifi

# allow access to SSL certificates, allowing use of external APIs (including MusicBrainz)
ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())

AUDIO_FILES_DIR = "../audio_files"

AUDIO_TYPES = {
    '.mp3', 
    '.flac', 
    '.wav', 
    '.m4a', 
    '.ogg',
    ".wma"
}

# set user agent for musicbrainz API to identify the application
musicbrainzngs.set_useragent(
    "Odio",
    "1.0.0",
    "https://github.com/mantot-123/AudioMetadataEditorWeb/"
)

app = Flask(__name__)

@app.route("/all-files")
def all_files():
    # list audio files in the directory and their basic info 
    # (not including subdirectories)
    try:
        fulldir = os.path.abspath(AUDIO_FILES_DIR)
        if not os.path.isdir(fulldir):
            raise FileNotFoundError(f"Directory {fulldir} does not exist.")

        filenames = [f for f in os.listdir(fulldir)
                    if os.path.isfile(os.path.join(fulldir, f))
                    and os.path.splitext(f)[1].lower() in AUDIO_TYPES]

        all_files = []
        for f in filenames:
            fpath = os.path.join(fulldir, f)
            if os.path.isfile(fpath):
                ext = os.path.splitext(f)[1].lower()
                stat = os.stat(fpath)
                
                mime_type, encoding = mimetypes.guess_type(f)
                details = {
                    "name": f,
                    "size": os.path.getsize(fpath),
                    "file_ext": ext,
                    "mime_type": mime_type,
                    "modify_time": stat.st_mtime
                }

                all_files.append(details)

        return all_files, 200
    except Exception as e:
        msg = f"Error occurred while accessing directory: {e}"
        traceback.print_exc()
        return {"error": msg}, 400

@app.route("/get-file/", methods=["GET"])
def get_file():
    '''
    GET BASE FILE DETAILS. INCLUDE:
    - file name
    - file size
    - mime type
    - file type
    - date modified
    '''
    try:
        filename = request.args.get("filename")
        if not filename:
            raise ValueError("File name is blank. Please enter a file name...")

        # check if file exists
        fullpath = os.path.abspath(os.path.join(AUDIO_FILES_DIR, filename))
        directory_abs = os.path.abspath(AUDIO_FILES_DIR)

        # check file existence
        if not os.path.isfile(fullpath):
            raise FileNotFoundError(f"File {fullpath} does not exist.")
        
        # prevent path traversal attacks - make sure files can only be accessed
        # inside the AUDIO_FILES_DIR absolute directory
        if not fullpath.startswith(directory_abs):
            raise Exception("Access denied: Invalid file name")
        
        # check if file's type is supported
        file_ext = os.path.splitext(filename)[1].lower()
        if not file_ext in AUDIO_TYPES:
            raise Exception(f"File {fullpath} has an unsupported file type.")
        
        # check file read access
        if not os.access(fullpath, os.R_OK):
            raise Exception(f"File {fullpath} has insufficient read permissions.")

        stat = os.stat(fullpath)
        mime_type, encoding = mimetypes.guess_type(fullpath)

        details = {
            "name": filename,
            "size": os.path.getsize(fullpath),
            "file_ext": file_ext,
            "mime_type": mime_type,
            "modify_time": stat.st_mtime
        }
        return details, 200
    
    except Exception as e:
        msg = f"Failed to read file: {e}"
        traceback.print_exc()
        return {"error": msg}, 400
    

@app.route("/rename-file", methods=["POST", "GET"])
def rename_file():
    try:
        directory_abs = os.path.abspath(AUDIO_FILES_DIR)

        current_fname = request.form.get("current_fname")
        new_fname = request.form.get("new_fname")

        if not current_fname:
            raise Exception("Please enter the current file's name. (current_fname)")
        
        if not new_fname:
            raise Exception("Please enter a new file name. (new_fname)")
        
        # check if the file exists
        filepath = os.path.join(directory_abs, current_fname)
        directory_abs = os.path.abspath(AUDIO_FILES_DIR)
        if not os.path.isfile(filepath):
            raise FileNotFoundError(f"File {filepath} does not exist.")
        
        current_fname_path = os.path.join(directory_abs, current_fname)
        new_fname_path = os.path.join(directory_abs, new_fname)
        # prevent directory traversal attacks
        if not current_fname_path.startswith(directory_abs):
            raise Exception("Access denied: Invalid current filename")
        
        if not new_fname_path.startswith(directory_abs):
            raise Exception("Access denied: Invalid new filename")

        # check if file extension supported for both current and new filenames
        # + check for matching extensions
        current_fname_ext = os.path.splitext(current_fname)[1].lower()
        if not current_fname_ext in AUDIO_TYPES:
            raise Exception(f"File format not supported. File is detected to be an '{current_fname_ext}' file, which is not an audio type.")

        new_fname_ext = os.path.splitext(new_fname)[1].lower()
        if not new_fname_ext in AUDIO_TYPES:
            raise Exception(f"New file name does not have the supported audio extension. File is detected to be an '{new_fname_ext}' file.")

        if current_fname_ext != new_fname_ext:
            raise ValueError(f"Current and new file names must have matching file extensions.")

        os.rename(current_fname_path, new_fname_path)

        return {"success": f"Successfully renamed file {current_fname_path} to {new_fname_path}"}, 200
    
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}, 400


@app.route("/delete-file")
def delete_file():
    try:
        filename = request.form.get("filename")

        if not filename:
            raise ValueError("File name is required")
    
        filepath = os.path.abspath(os.path.join(AUDIO_FILES_DIR, filename))
        directory_abs = os.path.abspath(AUDIO_FILES_DIR)

        # check if the file exists
        if not os.path.isfile(filepath):
            raise FileNotFoundError(f"File {filepath} does not exist.")
        
        # prevent directory traversal attacks
        if not filepath.startswith(directory_abs):
            raise Exception("Access denied: Invalid file name.")

        # check file write access - if deletion is allowed on the file
        if not os.access(filepath, os.W_OK):
            raise Exception(f"Insufficient write permissions for file {filepath}")
        
        file_ext = os.path.splitext(filename)[1].lower()
        if not file_ext in AUDIO_TYPES:
            raise Exception(f"Deletion failed. File is detected to be an '{file_ext}' file, which is not an audio type.")

        os.remove(filepath)

        return {"success": f"Successfully deleted file {filename}"}, 200
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}


@app.route("/browse-metadata", methods=["POST", "GET"])
def browse_metadata():
    try:
        data = request.get_json()

        if not data:
            return {"error": "No data provided."}, 400
        
        # search metadata relating to the track
        # results = musicbrainz_handler.api_search_recordings(data)
        results = musicbrainz_handler.search_musicbrainz_recordings(data)

        if not results:
            return results, 200

        return results, 200
    
    except Exception as e:
        traceback.print_exc()
        return {"error": "Unable to fetch metadata tag results."}, 400


@app.route("/read-metadata")
def read_metadata():
    pass


@app.route("/apply-metadata")
def apply_metadata():
    pass


@app.route("/apply-album-art")
def apply_album_art():
    pass


if __name__ == "__main__":
    app.run(debug=True)