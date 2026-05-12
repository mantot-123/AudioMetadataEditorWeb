from flask import Flask

app = Flask(__name__)

@app.route("/upload")
def uploadAudioFile():
    # TODO HANDLE FILE UPLOAD
    return {"file": "song.mp3", "contentType": "audio/mp3", "uploaded": True}

@app.route("/get")
def getAudioFile():
    # TODO HANDLE GETTING FILE DETAILS AND METADATA
    return {"file": "song.mp3", "contentType": "audio/mp3", "title": "You Can Always Come Home", "artist": "Toby Fox", "album": "DELTARUNE Chapter 1 (Original Game Soundtrack)"}

@app.route("/edit")
def editAudioFile():
    # TODO EDIT AUDIO FILE METADATA
    return {"file": "song.mp3", "modified": True, "newMetadata": {}}

@app.route("/search_meta")
def searchAudioMetadata():
    # TODO HANDLE AUDIO METADATA SEARCH - USE MUSICBRAINZ API FOR THIS 
    return {"title": "You Can Always Come Home", "artist": "Toby Fox", "album": "DELTARUNE Chapter 1 (Original Game Soundtrack)"}


if __name__ == "__main__":
    app.run(debug=True)