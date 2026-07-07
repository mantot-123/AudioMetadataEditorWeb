import os
import mimetypes
import mutagen
import traceback
import time
import musicbrainzngs
from flask import Flask, request

from editor_core import (musicbrainz_handler, 
                        album_art_handler,
                        mutagen_handler, 
                        settings_handler)

from editor_core.mutagen_handler import MutagenHandler
from editor_core.album_art_handler import AlbumArtHandler

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

ALLOWED_IMG_TYPES = {
    ".jpg",
    ".jpeg",
    ".png",
}

# set user agent for musicbrainz API to identify the application
musicbrainzngs.set_useragent(
    "Melaudic",
    "1.0.0",
    "https://github.com/mantot-123/AudioMetadataEditorWeb/"
)

app = Flask(__name__)

@app.route("/get-dir")
def get_dir():
    return {"dir": os.path.abspath(AUDIO_FILES_DIR)}, 200

@app.route("/all-files")
def all_files():
    # list audio files in the directory and their basic info 
    # (not including subdirectories)
    try:
        fulldir = os.path.abspath(AUDIO_FILES_DIR)
        if not os.path.isdir(fulldir):
            raise FileNotFoundError(f"Directory {fulldir} does not exist.")

        all_files = []
        for root, subdirs, files in os.walk(fulldir):
            for f in files:
                if not os.path.splitext(f)[1].lower() in AUDIO_TYPES:
                    continue

                fpath = os.path.abspath(os.path.join(root, f))
                rel_path = os.path.relpath(fpath, fulldir)
                dir = os.path.dirname(fpath)
                ext = os.path.splitext(fpath)[1].lower()
                stat = os.stat(fpath)

                mime_type, encoding = mimetypes.guess_type(f)

                details = {
                    "name": f,
                    "full_path": fpath,
                    "dir": dir,
                    "size": os.path.getsize(fpath),
                    "file_ext": ext,
                    "mime_type": mime_type,
                    "modify_time": stat.st_mtime
                }

                all_files.append(details)
        
        all_files.reverse()

        return all_files, 200
    except Exception as e:
        msg = f"Error occurred while accessing directory: {e}"
        traceback.print_exc()
        return {"error": msg}, 400

@app.route("/get-file", methods=["GET"])
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
        if not os.path.splitext(filename)[1].lower() in AUDIO_TYPES:
            Exception(f"Read failed. File is detected to be an '{os.path.splitext(filename)[1].lower()}' file, which is not an audio type.")
        
        # check file read access
        if not os.access(fullpath, os.R_OK):
            raise Exception(f"File {fullpath} has insufficient read permissions.")

        fulldir = os.path.abspath(AUDIO_FILES_DIR)
        fpath = os.path.join(fulldir, filename)
        rel_path = os.path.relpath(fpath, fulldir)
        dir = os.path.dirname(fpath)
        ext = os.path.splitext(fpath)[1].lower()
        stat = os.stat(fullpath)
        mime_type, encoding = mimetypes.guess_type(fullpath)

        reader = MutagenHandler(fullpath)

        # base file info + metadata
        metadata = reader.read_metadata()
        base_details = {
            "name": os.path.basename(filename),
            "full_path": fpath,
            "dir": dir,
            "size": os.path.getsize(fullpath),
            "file_ext": ext,
            "mime_type": mime_type,
            "modify_time": stat.st_mtime
        }

        result = metadata | base_details
        return {"error": None, "result": result}, 200
    
    except Exception as e:
        msg = f"Failed to read file: {e}"
        traceback.print_exc()
        return {"error": msg, "result": {}}, 400
    

@app.route("/rename-file", methods=["POST", "GET"])
def rename_file():
    try:
        working_dir_full = os.path.abspath(AUDIO_FILES_DIR)
        data = request.get_json()

        if not data:
            raise ValueError("No data provided.")
        
        if not "filename" in data or not data["filename"]:
            raise ValueError("File name is required.")
        
        if not "new_name" in data or not data["new_name"]:
            raise ValueError("Please enter a new file name")
        
        current_fname = data["filename"]
        new_fname = data["new_name"]
        
        # check if the file exists
        if not os.path.isfile(current_fname):
            raise FileNotFoundError(f"File {current_fname} does not exist.")
        
        dir = os.path.abspath(os.path.dirname(current_fname)) # directory of the current name of the file
        new_fname_path = os.path.join(dir, new_fname)

        # prevent directory traversal attacks
        if not current_fname.startswith(working_dir_full):
            raise Exception("Access denied: Invalid current filename")
        
        if not new_fname_path.startswith(working_dir_full):
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

        os.rename(current_fname, new_fname_path)

        rel_path = os.path.relpath(new_fname_path, working_dir_full)

        return {
            "result": f"Successfully renamed file {current_fname} to {new_fname_path}",
            "new_path": new_fname_path,
            "rel_path": rel_path,
        }, 200
    
    except Exception as e:
        traceback.print_exc()
        return {"result": str(e)}, 400


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

        return {"result": f"Successfully deleted file {filename}"}, 200
    except Exception as e:
        traceback.print_exc()
        return {"result": str(e)}, 400


@app.route("/browse-metadata", methods=["POST", "GET"])
def browse_metadata():
    try:
        data = {
            "title": request.args.get("title"),
            "album_artist": request.args.get("album_artist"),
            "album": request.args.get("album"),
            "year": request.args.get("year"),
            "track_number": request.args.get("track_number"),
            "disc_number": request.args.get("disc_number"),
            "genre": request.args.get("genre")
        }
        
        # search metadata relating to the track
        # results = musicbrainz_handler.api_search_recordings(data)
        results = musicbrainz_handler.search_musicbrainz_recordings(data)

        return {"error": None, "result": results}, 200
    
    except Exception as e:
        traceback.print_exc()
        return {"error": "Unable to fetch metadata tag results.", "result": {}}, 400


@app.route("/browse-art", methods=["GET", "POST"])
def browse_art():
    try:
        data = {
            "size": "small",
            "album_id": request.args.get("album_id")
        }
        result = musicbrainz_handler.search_musicbrainz_art_data(data)
        
        return {"error": None, "result": result}, 200
    
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e), "result": None}, 200


@app.route("/read-metadata", methods=["GET", "POST"])
def read_metadata():
    try:
        filename = request.args.get("filename")

        if not filename:
            raise ValueError("File name is required")
        
        directory_abs = os.path.abspath(AUDIO_FILES_DIR)
        filepath = os.path.abspath(os.path.join(AUDIO_FILES_DIR, filename))

        # check if the file exists
        if not os.path.isfile(filepath):
            raise FileNotFoundError(f"File {filepath} does not exist.")
        
        # prevent directory traversal attacks
        if not filepath.startswith(directory_abs):
            raise Exception("Access denied: Invalid file name.")

        # check file read access permissions - if reading metadata is allowed on the file
        if not os.access(filepath, os.R_OK):
            raise Exception(f"Insufficient read permissions for file {filepath}")
        
        file_ext = os.path.splitext(filename)[1].lower()
        if not file_ext in AUDIO_TYPES:
            raise Exception(f"Read failed. File is detected to be an '{file_ext}' file, which is not an audio type.")

        reader = MutagenHandler(filepath)
        results = reader.read_metadata()

        return { "error": None, "result": results }, 200
    
    except Exception as e:
        traceback.print_exc()
        return {
            "error": f"{str(e)}",
            "result": {}
        }, 400


@app.route("/get-album-art")
def get_album_art():
    try:
        filename = request.args.get("filename")
        if not filename:
            raise ValueError("File name is required")
        
        directory_abs = os.path.abspath(AUDIO_FILES_DIR)
        filepath = os.path.abspath(os.path.join(AUDIO_FILES_DIR, filename))

        # check if the file exists
        if not os.path.isfile(filepath):
            raise FileNotFoundError(f"File {filepath} does not exist.")
        
        # prevent directory traversal attacks
        if not filepath.startswith(directory_abs):
            raise Exception("Access denied: Invalid file name.")

        # check file read access permissions - if reading metadata is allowed on the file
        if not os.access(filepath, os.R_OK):
            raise Exception(f"Insufficient read permissions for file {filepath}")
        
        file_ext = os.path.splitext(filename)[1].lower()
        if not file_ext in AUDIO_TYPES:
            raise Exception(f"Read failed. File is detected to be an '{file_ext}' file, which is not an audio type.")

        reader = AlbumArtHandler(filepath)
        results = reader.get_cover_art()

        return { "error": None, "result": results }, 200
    
    except Exception as e:
        traceback.print_exc()
        return {
            "error": f"Unable to read album art metadata: {str(e)}",
            "result": {}
        }, 400


@app.route("/apply-metadata", methods=["POST", "GET"])
def apply_metadata():
    try:
        data = request.get_json()
        
        if not data:
            raise ValueError("No data provided.")
        
        if not "filename" in data or not data["filename"]:
            raise ValueError("File name is required.")
        
        if not "new_tags" in data or not data["new_tags"]:
            raise ValueError("No new tags are provided.")
        
        filename = data["filename"]
        new_tags = data["new_tags"]

        directory_abs = os.path.abspath(AUDIO_FILES_DIR)
        filepath = os.path.abspath(os.path.join(AUDIO_FILES_DIR, data["filename"]))

        # check if the file exists
        if not os.path.isfile(filepath):
            raise FileNotFoundError(f"File {filepath} does not exist.")
        
        # prevent directory traversal attacks
        if not filepath.startswith(directory_abs):
            raise Exception("Access denied: Invalid file name.")

        # check file write access permissions
        if not os.access(filepath, os.W_OK):
            raise Exception(f"Insufficient write permissions for file {filepath}")
        
        file_ext = os.path.splitext(filename)[1].lower()
        if not file_ext in AUDIO_TYPES:
            raise Exception(f"Write failed. File is detected to be an '{file_ext}' file, which is not an audio type.")

        writer = MutagenHandler(filepath)
        result = writer.set_metadata(data["new_tags"])

        return {"result": result }, 200
    
    except Exception as e:
        traceback.print_exc()
        return { "result": str(e) }, 400



@app.route("/apply-album-art", methods=["POST", "GET"])
def apply_album_art():
    try:
        audio_fname = request.form.get("audio_file")
        img_file = request.files.get("album_art")

        if not img_file:
            raise Exception("Image file not provided")
        
        directory_abs = os.path.abspath(AUDIO_FILES_DIR)
        filepath = os.path.abspath(os.path.join(AUDIO_FILES_DIR, audio_fname))

        # check if the file exists
        if not os.path.isfile(filepath):
            raise FileNotFoundError(f"Audio file {filepath} does not exist.")
        
        # prevent directory traversal attacks
        if not filepath.startswith(directory_abs):
            raise Exception("Access denied: Invalid audio file name.")

        # check file write access permissions
        if not os.access(filepath, os.W_OK):
            raise Exception(f"Insufficient write permissions for file {filepath}")
        
        audio_ext = os.path.splitext(audio_fname)[1].lower()
        if not audio_ext in AUDIO_TYPES:
            raise Exception(f"Write failed. File is detected to be an '{audio_ext}' file, which is not an audio type.")

        img_ext = os.path.splitext(img_file.filename)[1].lower()

        if not img_ext in ALLOWED_IMG_TYPES:
            raise Exception("Unsupported file type")
        
        img_file.seek(0)

        data = {
            "mime": img_file.mimetype,
            "img": img_file.read()
        }

        handler = AlbumArtHandler(filepath)

        handler.set_cover_art(data)

        return {"result": "Album art set successfully"}, 200
    except Exception as e:
        traceback.print_exc()
        return { "result": str(e) }, 400

    


if __name__ == "__main__":
    app.run(debug=True)