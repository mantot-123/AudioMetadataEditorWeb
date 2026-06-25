// context handler for fetched metadata to be put into the editor form
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AudioFileFullMetadata } from "../types/AudioFileFullMetadata";
import type { AudioUserTags } from "../types/AudioUserTags";
import type { DiscNumberTag } from "../types/DiscNumbertag";
import type { TrackNumberTag } from "../types/TrackNumberTag";

type Metadata = AudioFileFullMetadata;
type MetadataValueUpdater<K extends keyof Metadata> = Metadata[K] | ((currentValue: Metadata[K]) => Metadata[K]);

type MetadataContextType = {
  metadata: Metadata,
  setAudioFileMetadataValue: <K extends keyof Metadata>(key: K, value: MetadataValueUpdater<K>) => void,
  setUserTagValue: <K extends keyof AudioUserTags>(key: K, value: AudioUserTags[K]) => void,
  setTrackNumberValue: <K extends keyof TrackNumberTag>(key: K, value: TrackNumberTag[K]) => void,
  setDiscNumberValue: <K extends keyof DiscNumberTag>(key: K, value: DiscNumberTag[K]) => void,
  resetMetadata: () => void
}

export const MetadataContext = createContext<MetadataContextType | null>(null);

// empty metadata
const INITIAL_METADATA: Metadata = {
  filepath: "",
  format: "",
  duration: 0,
  bitrate: null,
  channels: null,
  sample_rate: null,
  tags: {
    title: null,
    album_artist: null,
    year: null,
    genre: null,
    album: null,
    track_number: null,
    disc_number: null,
  }
};

export default function MetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<Metadata>(INITIAL_METADATA);
  
  const setAudioFileMetadataValue = <K extends keyof Metadata>(key: K, value: MetadataValueUpdater<K>) => {
    setMetadata(metadata => ({
      ...metadata,
      [key]: typeof value === "function" ? value(metadata[key]) : value
    }));
  };

  // setter method for user metadata fields
  const setUserTagValue = <K extends keyof AudioUserTags>(key: K, value: AudioUserTags[K]) => {
    setAudioFileMetadataValue("tags", tags => ({ ...tags, [key]: value }));
  };

  const setTrackNumberValue = <K extends keyof TrackNumberTag>(key: K, value: TrackNumberTag[K]) => {
    setAudioFileMetadataValue("tags", tags => ({
      ...tags,
      track_number: {
        track_number: null,
        total_tracks: null,
        ...tags.track_number,
        [key]: value
      }
    }));
  };

  const setDiscNumberValue = <K extends keyof DiscNumberTag>(key: K, value: DiscNumberTag[K]) => {
    setAudioFileMetadataValue("tags", tags => ({
      ...tags,
      disc_number: {
        disc_number: null,
        total_discs: null,
        ...tags.disc_number,
        [key]: value
      }
    }));
  };

  // revert metadata to empty state
  const resetMetadata = () => setMetadata(INITIAL_METADATA);

  return ( 
    <MetadataContext.Provider value={ { metadata, setAudioFileMetadataValue, setUserTagValue, setTrackNumberValue, setDiscNumberValue, resetMetadata } }>
      {children}
    </MetadataContext.Provider>  
  );
}


export const useMetadata = () => {
  const ctx: MetadataContextType | null = useContext(MetadataContext);
  if (!ctx) throw new Error("useCurrentFile must be used within CurrentFileProvider");
  return ctx;
};
