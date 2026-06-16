import time
import traceback
import musicbrainzngs
from datetime import datetime

# METADATA BROWSER HANDLER FOR AUDIO METADATA TAG LOOKUP
# UTILISES MUSICBRAINZ'S API

# limit the number of results that can be returned from a search query
MUSICBRAINZ_RESULT_LIMIT = 50

# match score - confidence rating of how well the results match with the query
# higher matching score - strong match
# minimum of around 70 often recommended to get the most accurate results
MUSICBRAINZ_MIN_MATCH_SCORE = 70

# search for recordings of the same title and artist and its related releases
def search_musicbrainz_recordings(data):
    # search metadata relating to the track
    fields = data.get("query", {})
    query = {}

    # map each metadata field from request to musicbrainz search query fields
    if "title" in fields: query["recording"] = fields["title"]
    if "artist" in fields: query["artist"] = fields["artist"]
    if "album" in fields: query["release"] = fields["album"]
    if "genre" in fields: query["tag"] = fields["genre"]
    if "year" in fields: query["date"] = fields["year"]

    try:
        results = musicbrainzngs.search_recordings(**query, limit=MUSICBRAINZ_RESULT_LIMIT)
        time.sleep(1)

        if not results or not results.get("recording-list", []):
            return []
        
        # only include recorings with meeting minimum match score
        recordings = [r for r in results.get("recording-list", []) 
                    if int(r.get("ext:score", 0)) >= MUSICBRAINZ_MIN_MATCH_SCORE]

        output = []

        for rec in recordings:
            if not isinstance(rec, dict):
                continue

            # get artist information
            artists = []
            for a in rec.get("artist-credit", []):
                if not isinstance(a, dict):
                    continue

                artist = a.get("artist", {})
                id = artist.get("id", None)
                name = a.get("name", None)
                artists.append({
                    "id": id,
                    "name": name
                })
            
            # if no release is available, only supply base MBID, title and artist info instead
            if not rec.get("release-list"):
                output.append({
                    "id": rec.get("id", None),
                    "title": rec.get("title", None),
                    "artist": artists,
                    "year": None,
                    "genre": [],
                    "album": None,
                    "albumId": None,
                    "trackNumber": None,
                    "discNumber": None,
                    "dateReleased": None
                })
                continue

            # add release information to the song as separate list elements
            for release in rec.get("release-list", []):
                genre_list = [t.get("name", "") for t in release.get("tag-list", [])]

                # medium information (e.g. disc, vinyl)
                # only get the first medium info in the medium-list
                medium_list = release.get("medium-list", [])
                medium = medium_list[0] if medium_list else {}

                # track information
                track_list = medium.get("track-list", [])
                track = track_list[0] if track_list else {}

                date = release.get("date", None)
                year = date[:4] if date else None

                output.append({
                    "id": rec.get("id", ""),
                    "title": rec.get("title", None),
                    "artist": artists,
                    "year": year,
                    "genre": genre_list,
                    "album": release.get("title", None),
                    "albumId": release.get("id", None),
                    "trackNumber": track.get("number", None),
                    "discNumber": medium.get("number", None),
                    "dateReleased": date
                })

    except Exception as e:
        traceback.print_exc()
        return {
            "error": f"Failed to fetch tagging information: {str(e)}",
            "results": []
        }

    return {
        "results": output
    }


def get_musicbrainz_release_data(**query_args):
    pass


def get_musicbrainz_artist_data(**query_args):
    pass


# method to test musicbrainz's API.
def api_search_recordings(data):
    # search metadata relating to the track
    fields = data.get("query", {})

    query = {}

    if "title" in fields: query["recording"] = fields["title"]
    if "artist" in fields: query["artist"] = fields["artist"]
    if "album" in fields: query["release"] = fields["album"]
    if "genre" in fields: query["tag"] = fields["genre"]
    if "year" in fields: query["date"] = fields["year"]

    results = musicbrainzngs.search_recordings(**query, limit=MUSICBRAINZ_RESULT_LIMIT)

    time.sleep(1)

    if not results.get("recording-list", []) or not results:
        return [], 200

    output = results

    return output