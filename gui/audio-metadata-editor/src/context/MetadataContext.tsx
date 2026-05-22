// context handler for fetched metadata to be put into the editor form
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export const MetadataContext = createContext<any>(null);

type Metadata = {
  id: number | null;
  title: string | null;
  artist: string | null;
  year: string | null;
  genre: string | null;
  album: string | null;
  trackNumber: string | null;
  discNumber: string | null;
  dateReleased: string | null;
}

export default function MetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<Metadata>({
    id: null,
    title: null,
    artist: null,
    year: null,
    genre: null,
    album: null, 
    trackNumber: null,
    discNumber: null,
    dateReleased: null
  });
  
  // setter methods for each metadata field
  const setId = (id: number) => setMetadata(metadata => ({ ...metadata, id: id}))
  const setTitle = (title: string) => setMetadata(metadata => ({ ...metadata, title: title }));
  const setArtist = (artist: string) => setMetadata(metadata => ({ ...metadata, artist: artist }));
  const setYear = (year: string) => setMetadata(metadata => ({ ...metadata, year: year }));
  const setGenre = (genre: string) => setMetadata(metadata => ({ ...metadata, genre: genre }));
  const setAlbum = (album: string) => setMetadata(metadata => ({ ...metadata, album: album }));
  const setTrackNumber = (trackNumber: string) => setMetadata(metadata => ({ ...metadata, trackNumber: trackNumber }));
  const setDiscNumber = (discNumber: string) => setMetadata(metadata => ({ ...metadata, discNumber: discNumber }));
  const setDateReleased = (dateReleased: string) => setMetadata(metadata => ({ ...metadata, dateReleased: dateReleased }));

  return ( 
    <MetadataContext.Provider value={ { metadata, setId, setTitle, setArtist, setYear, setGenre, setAlbum, setTrackNumber, setDiscNumber, setDateReleased } }>
      {children}
    </MetadataContext.Provider>  
  );
}


export const useMetadata = () => useContext(MetadataContext);