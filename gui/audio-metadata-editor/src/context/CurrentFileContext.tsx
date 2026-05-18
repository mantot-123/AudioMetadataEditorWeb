import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// stores information about the current file that is opened
// also saves them on to the disk, so the file can be immediately loaded when the app is reopened
export const CurrentFileContext = createContext<any>(null);

type CurrentFile = {
  fileName: string
};

export default function CurrentFileProvider({ children }: { children: ReactNode }) {
  const [fileInfo, setFileInfo] = useState(() => {
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

  const setCurrentFileName = (newFileName: string) => setFileInfo({...fileInfo, fileName: newFileName });

  return ( 
    <CurrentFileContext.Provider value={{ fileInfo, setCurrentFileName }}>
      {children}
    </CurrentFileContext.Provider> 
  );
}

export const useCurrentFile = () => useContext(CurrentFileContext);