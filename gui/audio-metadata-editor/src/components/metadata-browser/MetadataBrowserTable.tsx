import { useState } from "react";
import { Icon } from "@iconify/react";

import type { AudioUserTags } from "../../types/AudioUserTags";

// sample data for track information. this can be replaced
const SAMPLE_TRACKS: AudioUserTags[] = [
  {
    title: "Bohemian Rhapsody",
    album_artist: "Queen",
    year: "1975",
    genre: "Rock",
    album: "A Night at the Opera",
    track_number: "11/12",
    disc_number: "1"
  },
  {
    title: "Blinding Lights",
    album_artist: "The Weeknd",
    year: "2019",
    genre: "Synth-pop",
    album: "After Hours",
    track_number: "2/14",
    disc_number: "1"
  },
  {
    title: "Hotel California",
    album_artist: "Eagles",
    year: "1977",
    genre: "Soft Rock",
    album: "Hotel California",
    track_number: "1/9",
    disc_number: "1"
  },
  {
    title: "Smells Like Teen Spirit",
    album_artist: "Nirvana",
    year: "1991",
    genre: "Grunge",
    album: "Nevermind",
    track_number: "1/13",
    disc_number: "1"
  },
  {
    title: "Rolling in the Deep",
    album_artist: "Adele",
    year: "2010",
    genre: "Soul",
    album: "21",
    track_number: "1/11",
    disc_number: "1"
  },
  {
    title: "Billie Jean",
    album_artist: "Michael Jackson",
    year: "1982",
    genre: "R&B",
    album: "Thriller",
    track_number: "6/9",
    disc_number: "1"
  },
  {
    title: "Shape of You",
    album_artist: "Ed Sheeran",
    year: "2017",
    genre: "Pop",
    album: "Divide",
    track_number: "1/16",
    disc_number: "1"
  },
  {
    title: "Good as Hell",
    album_artist: "Lizzo",
    year: "2016",
    genre: "Pop",
    album: "Coconut Oil",
    track_number: "3/5",
    disc_number: "1"
  },
  {
    title: "Lose Yourself",
    album_artist: "Eminem",
    year: "2002",
    genre: "Hip-Hop",
    album: "8 Mile Soundtrack",
    track_number: "1/16",
    disc_number: "1"
  },
  {
    title: "Watermelon Sugar",
    album_artist: "Harry Styles",
    year: "2019",
    genre: "Pop Rock",
    album: "Fine Line",
    track_number: "2/12",
    disc_number: "1"
  },
  {
    title: "Megalovania",
    album_artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    track_number: "101/101",
    disc_number: "1"
  },
  {
    title: "Undertale",
    album_artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    track_number: "83/101",
    disc_number: "1"
  },
  {
    title: "Hopes and Dreams",
    album_artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    track_number: "96/101",
    disc_number: "1"
  },
  {
    title: "Death by Glamour",
    album_artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    track_number: "62/101",
    disc_number: "1"
  },
  {
    title: "Spear of Justice",
    album_artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    track_number: "49/101",
    disc_number: "1"
  },
  {
    title: "Field of Hopes and Dreams",
    album_artist: "Toby Fox",
    year: "2018",
    genre: "Chiptune",
    album: "Deltarune Chapter 1 OST",
    track_number: "4/24",
    disc_number: "1"
  },
  {
    title: "A Cyber's World?",
    album_artist: "Toby Fox",
    year: "2021",
    genre: "Chiptune",
    album: "Deltarune Chapter 2 OST",
    track_number: "12/38",
    disc_number: "1"
  }
];


interface MetadataBrowserTableProps {
  initialQuery: string
  initialSelected: AudioUserTags | null,
  onRowSelect(d: any): void
}

function MetadataBrowserTable({ initialQuery, initialSelected, onRowSelect }: MetadataBrowserTableProps) {  
  const [query, setQuery] = useState<string>(initialQuery);

  // keep track of the row that was selected so it gets an "active" status
  const [selected, setSelected] = useState<AudioUserTags | null>(initialSelected); 
  const [results, setResults] = useState(SAMPLE_TRACKS);

  return ( 
    <>
      <form>
        <div className="input-group my-4">
          <div className="input-group append">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search track, album, artist or genre..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-dark d-flex gap-2 align-items-center" type="button">
              <Icon icon="material-symbols:search" />
              Search
            </button>
          </div>
        </div>
      </form>

      {(results.length > 0) ? ( // show the table if found results from the query
        <div 
          className="table-responsive border rounded"
          style={{
            maxHeight: "min(40vh, 420px)",
            overflow: "auto",
          }}>
          <table 
            className="table table-hover align-middle"
            style={{
              width: "max-content", 
              minWidth: "960px" 
            }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Album</th>
                <th>Track #</th>
                <th>Disc #</th>
              </tr>
            </thead>
            <tbody>
              {results.map((d, i) => (
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() => { 
                    if(selected) {
                      setSelected(null);
                      return;
                    }
                    setSelected(d);
                    onRowSelect(d);
                  }}
                  className={selected === d ? "table-active" : ""}
                >
                  <td>{d.title}</td>
                  <td>{d.album}</td>
                  <td>{d.album_artist}</td>
                  <td>{d.genre}</td>
                  <td>{d.album}</td>
                  <td>{d.track_number}</td>
                  <td>{d.disc_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Icon icon="nonicons:not-found-16" fontSize="48" style={{ marginTop: "20px", marginBottom: "20px" }} />
          <h4>No results found</h4>
          <p>No data is currently available for this song. However, you can still search for the song manually (if you know what you are looking for).</p>
        </div>
      )}
    </>
  );
}

export default MetadataBrowserTable;