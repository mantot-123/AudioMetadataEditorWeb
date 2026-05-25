import { useState } from "react";
import { Icon } from "@iconify/react";

import { useMetadata } from "../context/MetadataContext";

// sample data for track information. this can be replaced
const SAMPLE_TRACKS = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    year: "1975",
    genre: "Rock",
    album: "A Night at the Opera",
    trackNumber: "11/12",
    dateReleased: "31 October 1975"
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    year: "2019",
    genre: "Synth-pop",
    album: "After Hours",
    trackNumber: "2/14",
    dateReleased: "29 November 2019"
  },
  {
    id: 3,
    title: "Hotel California",
    artist: "Eagles",
    year: "1977",
    genre: "Soft Rock",
    album: "Hotel California",
    trackNumber: "1/9",
    dateReleased: "10 February 1977"
  },
  {
    id: 4,
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    year: "1991",
    genre: "Grunge",
    album: "Nevermind",
    trackNumber: "1/13",
    dateReleased: "10 September 1991"
  },
  {
    id: 5,
    title: "Rolling in the Deep",
    artist: "Adele",
    year: "2010",
    genre: "Soul",
    album: "21",
    trackNumber: "1/11",
    dateReleased: "29 November 2010"
  },
  {
    id: 6,
    title: "Billie Jean",
    artist: "Michael Jackson",
    year: "1982",
    genre: "R&B",
    album: "Thriller",
    trackNumber: "6/9",
    dateReleased: "2 January 1983"
  },
  {
    id: 7,
    title: "Shape of You",
    artist: "Ed Sheeran",
    year: "2017",
    genre: "Pop",
    album: "Divide",
    trackNumber: "1/16",
    dateReleased: "6 January 2017"
  },
  {
    id: 8,
    title: "Good as Hell",
    artist: "Lizzo",
    year: "2016",
    genre: "Pop",
    album: "Coconut Oil",
    trackNumber: "3/5",
    dateReleased: "30 September 2016"
  },
  {
    id: 9,
    title: "Lose Yourself",
    artist: "Eminem",
    year: "2002",
    genre: "Hip-Hop",
    album: "8 Mile Soundtrack",
    trackNumber: "1/16",
    dateReleased: "28 October 2002"
  },
  {
    id: 10,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    year: "2019",
    genre: "Pop Rock",
    album: "Fine Line",
    trackNumber: "2/12",
    dateReleased: "16 May 2019"
  },
  {
    id: 11,
    title: "Megalovania",
    artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    trackNumber: "101/101",
    dateReleased: "15 September 2015"
  },
  {
    id: 12,
    title: "Undertale",
    artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    trackNumber: "83/101",
    dateReleased: "15 September 2015"
  },
  {
    id: 13,
    title: "Hopes and Dreams",
    artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    trackNumber: "96/101",
    dateReleased: "15 September 2015"
  },
  {
    id: 14,
    title: "Death by Glamour",
    artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    trackNumber: "62/101",
    dateReleased: "15 September 2015"
  },
  {
    id: 15,
    title: "Spear of Justice",
    artist: "Toby Fox",
    year: "2015",
    genre: "Chiptune",
    album: "Undertale Soundtrack",
    trackNumber: "49/101",
    dateReleased: "15 September 2015"
  },
  {
    id: 16,
    title: "Field of Hopes and Dreams",
    artist: "Toby Fox",
    year: "2018",
    genre: "Chiptune",
    album: "Deltarune Chapter 1 OST",
    trackNumber: "4/24",
    dateReleased: "31 October 2018"
  },
  {
    id: 17,
    title: "A Cyber's World?",
    artist: "Toby Fox",
    year: "2021",
    genre: "Chiptune",
    album: "Deltarune Chapter 2 OST",
    trackNumber: "12/38",
    dateReleased: "17 September 2021"
  }
];


interface MetadataBrowserTableProps {
  initialQuery: string
  initialSelected: object | null,
  onRowSelect(d: any): void
}

function MetadataBrowserTable({ initialQuery, initialSelected, onRowSelect }: MetadataBrowserTableProps) {
  const [query, setQuery] = useState<string>(initialQuery);

  // keep track of the row that was selected so it gets an "active" status
  const [selected, setSelected] = useState<object | null>(initialSelected); 
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
                <th>Date released</th>
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
                  <td>{d.artist}</td>
                  <td>{d.genre}</td>
                  <td>{d.album}</td>
                  <td>{d.trackNumber}</td>
                  <td>{d.trackNumber}</td>
                  <td>{d.dateReleased}</td>
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