// context handler for fetched metadata to be put into the editor form
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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

type MetadataContextType = {
  metadata: Metadata,
  setId: (id: number | null) => void,
  setTitle: (title: string | null) => void,
  setArtist: (artist: string | null) => void,
  setYear: (year: string | null) => void,
  setGenre: (genre: string | null) => void,
  setAlbum: (album: string | null) => void,
  setTrackNumber: (trackNumber: string | null) => void,
  setDiscNumber: (discNumber: string | null) => void,
  setDateReleased: (dateReleased: string | null) => void
}

export const MetadataContext = createContext<MetadataContextType | null>(null);

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
  const setId = (id: number | null) => setMetadata(metadata => ({ ...metadata, id: id}))
  const setTitle = (title: string | null) => setMetadata(metadata => ({ ...metadata, title: title }));
  const setArtist = (artist: string | null) => setMetadata(metadata => ({ ...metadata, artist: artist }));
  const setYear = (year: string | null) => setMetadata(metadata => ({ ...metadata, year: year }));
  const setGenre = (genre: string | null) => setMetadata(metadata => ({ ...metadata, genre: genre }));
  const setAlbum = (album: string | null) => setMetadata(metadata => ({ ...metadata, album: album }));
  const setTrackNumber = (trackNumber: string | null) => setMetadata(metadata => ({ ...metadata, trackNumber: trackNumber }));
  const setDiscNumber = (discNumber: string | null) => setMetadata(metadata => ({ ...metadata, discNumber: discNumber }));
  const setDateReleased = (dateReleased: string | null) => setMetadata(metadata => ({ ...metadata, dateReleased: dateReleased }));

  return ( 
    <MetadataContext.Provider value={ { metadata, setId, setTitle, setArtist, setYear, setGenre, setAlbum, setTrackNumber, setDiscNumber, setDateReleased } }>
      {children}
    </MetadataContext.Provider>  
  );
}


export const useMetadata = () => {
  const ctx: MetadataContextType | null = useContext(MetadataContext);
  if (!ctx) throw new Error("useCurrentFile must be used within CurrentFileProvider");
  return ctx;
};