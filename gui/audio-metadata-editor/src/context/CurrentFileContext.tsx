import { createContext, useCallback, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AudioFile } from "../types/AudioFile";
import type { AudioUserTags } from "../types/AudioUserTags";

type CurrentFileUpdater<K extends keyof AudioFile> = AudioFile[K] | ((currentValue: AudioFile[K]) => AudioFile[K]);

type CurrentFileContextType = {
  fileInfo: AudioFile | null,
  updateCurrentFileValue: <K extends keyof AudioFile>(key: K, value: CurrentFileUpdater<K>) => void;
  updateUserTagValue: <K extends keyof AudioUserTags>(key: K, value: AudioUserTags[K]) => void,
  resetCurrentFile: () => void
}

const INITIAL_FILE: AudioFile = {
  id: null,
  name: null,
  full_path: null,
  size: null,
  file_ext: null,
  mime_type: null,
  modify_time: null,
  tag_sys: null,
  format: null,
  duration: null,
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
}

// stores information about the current file that is opened
// also saves them on to the disk, so the file can be immediately loaded when the app is reopened
export const CurrentFileContext = createContext<CurrentFileContextType | null>(null);

export default function CurrentFileProvider({ children }: { children: ReactNode }) {
  const [fileInfo, setFileInfo] = useState<AudioFile>(INITIAL_FILE);

  //
  const updateCurrentFileValue = useCallback(<K extends keyof AudioFile>(key: K, value: CurrentFileUpdater<K>) => {
    setFileInfo((currentFile) => {
      const base = currentFile ?? INITIAL_FILE;
      return {
        ...base,
        [key]: typeof value === "function"
          ? value(base[key])
          : value
      };
    });
  }, []);

  
  // setter method for user metadata fields
  const updateUserTagValue = <K extends keyof AudioUserTags>(key: K, value: AudioUserTags[K]) => {
    updateCurrentFileValue("tags", (tags) => ({ ...tags, [key]: value }));
  };

  //
  const resetCurrentFile = () => setFileInfo(INITIAL_FILE);

  return ( 
    <CurrentFileContext.Provider value={{ fileInfo, updateCurrentFileValue, updateUserTagValue, resetCurrentFile }}>
      {children}
    </CurrentFileContext.Provider> 
  );
}

export const useCurrentFile = () => {
  const ctx: CurrentFileContextType | null = useContext(CurrentFileContext);
  if(!ctx) throw new Error("useCurrentFile must be used within CurrentFileProvider");
  return ctx;
};