// context handler for fetched metadata to be put into the editor form
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AudioUserTags } from "../types/AudioUserTags";
import type { DiscNumberTag } from "../types/DiscNumbertag";
import type { TrackNumberTag } from "../types/TrackNumberTag";

type Metadata = AudioUserTags;

type MetadataContextType = {
  metadata: Metadata,
  setMetadataValue: <K extends keyof Metadata>(key: K, value: Metadata[K]) => void,
  setTrackNumberValue: <K extends keyof TrackNumberTag>(key: K, value: TrackNumberTag[K]) => void,
  setDiscNumberValue: <K extends keyof DiscNumberTag>(key: K, value: DiscNumberTag[K]) => void,
  resetMetadata: () => void
}

export const MetadataContext = createContext<MetadataContextType | null>(null);

// empty metadata
const INITIAL_METADATA: Metadata = {
  title: null,
  album_artist: null,
  year: null,
  genre: null,
  album: null,
  track_number: null,
  disc_number: null,
};

export default function MetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<Metadata>(INITIAL_METADATA);
  
  // setter method for metadata fields
  const setMetadataValue = <K extends keyof Metadata>(key: K, value: Metadata[K]) => {
    setMetadata(metadata => ({ ...metadata, [key]: value }));
  };

  const setTrackNumberValue = <K extends keyof TrackNumberTag>(key: K, value: TrackNumberTag[K]) => {
    setMetadata(metadata => ({
      ...metadata,
      track_number: {
        track_number: null,
        total_tracks: null,
        ...metadata.track_number,
        [key]: value
      }
    }));
  };

  const setDiscNumberValue = <K extends keyof DiscNumberTag>(key: K, value: DiscNumberTag[K]) => {
    setMetadata(metadata => ({
      ...metadata,
      disc_number: {
        disc_number: null,
        total_discs: null,
        ...metadata.disc_number,
        [key]: value
      }
    }));
  };

  // revert metadata to empty state
  const resetMetadata = () => setMetadata(INITIAL_METADATA);

  return ( 
    <MetadataContext.Provider value={ { metadata, setMetadataValue, setTrackNumberValue, setDiscNumberValue, resetMetadata } }>
      {children}
    </MetadataContext.Provider>  
  );
}


export const useMetadata = () => {
  const ctx: MetadataContextType | null = useContext(MetadataContext);
  if (!ctx) throw new Error("useCurrentFile must be used within CurrentFileProvider");
  return ctx;
};
