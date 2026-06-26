import { createContext, useCallback, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AudioFile } from "../types/AudioFile";

type CurrentFileContextType = {
  fileInfo: AudioFile | null,
  updateCurrentFile: (updates: Partial<AudioFile> | null) => void
}

const isAudioFile = (value: unknown): value is AudioFile => {
  if (!value || typeof value !== "object") return false;

  const file = value as AudioFile;
  return (
    typeof file.name === "string" &&
    typeof file.rel_path === "string" &&
    typeof file.full_path === "string" &&
    typeof file.size === "number" &&
    typeof file.file_ext === "string" &&
    (typeof file.mime_type === "string" || file.mime_type === null) &&
    typeof file.modify_time === "number"
  );
};

// stores information about the current file that is opened
// also saves them on to the disk, so the file can be immediately loaded when the app is reopened
export const CurrentFileContext = createContext<CurrentFileContextType | null>(null);

export default function CurrentFileProvider({ children }: { children: ReactNode }) {
  const [fileInfo, setFileInfo] = useState<AudioFile | null>(() => {
    // check if a "currentFile" key exists in the local storage
    // if yes, load that file
    // if no, or the value in the key is corrupted, then use no selected file
    try {
      const saved: string | null = localStorage.getItem("currentFile");
      if(!saved) return null;

      const parsed = JSON.parse(saved);

      if(!isAudioFile(parsed))
        return null;

      return parsed;

    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!fileInfo) {
      localStorage.removeItem("currentFile");
      return;
    }

    localStorage.setItem("currentFile", JSON.stringify(fileInfo));
  }, [fileInfo]);

  const updateCurrentFile = useCallback((updates: Partial<AudioFile> | null) => {
    if (updates === null) {
      setFileInfo(null);
      return;
    }

    setFileInfo((currentFile) => {
      if (!currentFile) {
        return isAudioFile(updates) ? updates : null;
      }

      return { ...currentFile, ...updates };
    });
  }, []);

  return ( 
    <CurrentFileContext.Provider value={{ fileInfo, updateCurrentFile }}>
      {children}
    </CurrentFileContext.Provider> 
  );
}

export const useCurrentFile = () => {
  const ctx: CurrentFileContextType | null = useContext(CurrentFileContext);
  if(!ctx) throw new Error("useCurrentFile must be used within CurrentFileProvider");
  return ctx;
};