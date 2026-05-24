import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type CurrentFile = {
  fileName: string | null
};

type CurrentFileContextType = {
  fileInfo: CurrentFile | null,
  setCurrentFileName: (newFileName: string | null) => void
}

// stores information about the current file that is opened
// also saves them on to the disk, so the file can be immediately loaded when the app is reopened
export const CurrentFileContext = createContext<CurrentFileContextType | null>(null);

export default function CurrentFileProvider({ children }: { children: ReactNode }) {
  const [fileInfo, setFileInfo] = useState<CurrentFile | null>(() => {
    // fallback value in case the current file info cannot be loaded from storage
    const defaults: CurrentFile = {
      fileName: ""
    };

    // check if a "currentFile" key exists in the local storage
    // if yes, load that file
    // if no, or the value in the key is corrupted, then use the fallback
    try {
      const saved: string | null = localStorage.getItem("currentFile");
      if(!saved) return defaults;

      const parsed = JSON.parse(saved);

      if(!parsed || typeof parsed !== "object")
        return defaults;

      return parsed as CurrentFile | null;

    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem("currentFile", JSON.stringify(fileInfo as object));
  }, [fileInfo]);

  const setCurrentFileName = (newFileName: string | null) => setFileInfo({...fileInfo, fileName: newFileName });

  return ( 
    <CurrentFileContext.Provider value={{ fileInfo, setCurrentFileName }}>
      {children}
    </CurrentFileContext.Provider> 
  );
}

export const useCurrentFile = () => {
  const ctx: CurrentFileContextType | null = useContext(CurrentFileContext);
  if(!ctx) throw new Error("useCurrentFile must be used within CurrentFileProvider");
  return ctx;
};