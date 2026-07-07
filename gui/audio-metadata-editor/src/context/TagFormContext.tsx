import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AudioUserTags } from "../types/AudioUserTags";

type TagFormContextType = {
  userTags: AudioUserTags;
  setTagFormValue: <K extends keyof AudioUserTags>(key: K, value: AudioUserTags[K]) => void,
  setAllFormTags: (tags: AudioUserTags) => void
};

type UserTagFormUpdater<K extends keyof AudioUserTags> = AudioUserTags[K] | ((currentValue: AudioUserTags[K]) => AudioUserTags[K]);

export const TagFormContext = createContext<TagFormContextType | null>(null);

const INITIAL_FORM_VALS = {
  title: null,
  album_artist: null,
  album: null,
  year: null,
  track_number: null,
  disc_number: null,
  genre: null,
};

export default function TagFormProvider({ children }: { children: ReactNode }) {
  // setter method for user metadata fields
  const [userTags, setUserTags] = useState<AudioUserTags>(INITIAL_FORM_VALS);

  const setTagFormValue = <K extends keyof AudioUserTags>(key: K, value: UserTagFormUpdater<K>) => {
    setUserTags(userTags => ({
      ...userTags,
      [key]: typeof value === "function" ? value(userTags[key]) : value
    }));
  };

  const setAllFormTags = (tags: AudioUserTags) => setUserTags(tags);

  return ( 
    <TagFormContext.Provider value={ { userTags, setTagFormValue, setAllFormTags } }>
      {children}
    </TagFormContext.Provider>
  );
}


export const useTagForm = () => {
  const ctx: TagFormContextType | null = useContext(TagFormContext);
  if (!ctx) throw new Error("useTagForm must be used within TagFormProvider");
  return ctx;
};
