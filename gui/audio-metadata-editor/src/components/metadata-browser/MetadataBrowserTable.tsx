import axios from "axios";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import type { AudioUserTags } from "../../types/AudioUserTags";

interface MetadataBrowserTableProps {
  initialQuery: object | null,
  initialSelected: object | null,
  onRowSelect(d: any): void
}

function MetadataBrowserTable({ initialQuery, initialSelected, onRowSelect }: MetadataBrowserTableProps) {  
  const [query, setQuery] = useState<any>(initialQuery);

  // keep track of the row that was selected so it gets an "active" status
  const [selected, setSelected] = useState<any>(initialSelected); 
  const [results, setResults] = useState<any[]>([]);
  const [artResults, setArtResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true);

        // fetch metadata tags
        const tagsQuery = await axios.get("/browse-metadata", {
          params: {
            title: query?.title,
            album_artist: query?.album_artist,
            album: query?.album,
            year: query?.year,
            genre: query?.genre,
            track_number: query?.track_number,
            disc_number: query?.disc_number
          }
        });
        
        const tagsQueryResult = tagsQuery.data.result;
        setResults(tagsQueryResult);

        // fetch album art
        const albumArtList = tagsQueryResult.map(async (tag: any) => {
          const artQuery = await axios.get("/browse-art", {
            params: { album_id: tag["album_id"] }
          });
          
          const artUrl = artQuery.data.result;
          return artUrl;
        });

        const albumArtResults = await Promise.all(albumArtList);

        tagsQueryResult.forEach((tag: any, index: number) => {
          tag.album_art = albumArtResults[index];
        });

        console.log(tagsQueryResult);
        setResults(tagsQueryResult);
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTags();
  }, []);

  const formatArtists = (artists: any[]) => {
    if(Array.isArray(artists)) {
      const artistNames = artists.map((artist: any) => artist.name);
      return artistNames.join(", ");
    }
    return "";
  }

  const formatGenres = (genres: any[]) => {
    if(Array.isArray(genres)) {
      const genreNames = genres.map((genre: any) => genre);
      return genreNames.join(", ");
    }
    return "";
  }

  return ( 
    <>    
      {(results.length > 0 && !isLoading) ? ( // show the table if found results from the query
        <>
          <h5 className="mb-4">Results</h5>
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
                minWidth: "100%" 
              }}>
              <thead>
                <tr>
                  <th>Album Art</th>
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
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => { 
                      if(selected?.id === i) {
                        setSelected(null);
                        onRowSelect(null);
                        return;
                      }
                      const rowSelected = {
                        id: i,
                        title: d.title,
                        album_artist: formatArtists(d.artist),
                        album: d.album,
                        year: d.year,
                        genre: formatGenres(d.genre),
                        track_number: d.track_number,
                        disc_number: d.disc_number
                      };
                      setSelected(rowSelected);
                      onRowSelect(rowSelected);
                    }}
                    className={selected?.id === i ? "table-active" : ""}
                  >
                    <td>
                      {d.album_art
                        ? <img src={d.album_art} alt="Album Art" style={{ maxWidth: "4rem", maxHeight: "auto" }} /> 
                        : <div className="ratio ratio-1x1 bg-light text-secondary" style={{ maxWidth: "4rem", maxHeight: "auto" }}>
                          <Icon icon="mdi:music" fontSize="24" style={{padding: "0.5rem"}}/>
                        </div> 
                        }
                    </td>
                    <td>{d.title}</td>
                    <td>{formatArtists(d.artist)}</td>
                    <td>{d.year}</td>
                    <td>{formatGenres(d.genre)}</td>
                    <td>{d.album}</td>
                    <td>{d.track_number}</td>
                    <td>{d.disc_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) 
        : (results.length === 0 && !isLoading) ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Icon icon="nonicons:not-found-16" fontSize="48" style={{ marginTop: "20px", marginBottom: "20px" }} />
          <h4>No results found</h4>
          <p>No data is currently available for this song. However, you can still search for the song manually (if you know what you are looking for).</p>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h5>Loading...</h5>
          <div className="spinner-border text-dark" role="status" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Please wait while we fetch metadata from MusicBrainz's database...</p>
        </div>
      )}
    </>
  );
}

export default MetadataBrowserTable;