import StartPage from "./StartPage";
import EditAudioPage from "./EditAudioPage";
import SettingsPage from "./SettingsPage";
import { useCurrentFile } from "../context/CurrentFileContext";
import { useMetadata } from "../context/MetadataContext";
import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router";

function EditorMain() {
  const navigate = useNavigate();

  const {fileInfo, setCurrentFileName} = useCurrentFile();

  const {
    metadata,
    setId,
    setTitle,
    setArtist,
    setYear,
    setGenre,
    setAlbum,
    setTrackNumber,
    setDiscNumber,
    setDateReleased
  } = useMetadata();

  const goBack = () => {
    setCurrentFileName(null);
    navigate("/") 
  };

  return ( 
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/edit" element={<EditAudioPage goBack={goBack}/>} />
          <Route path="/settings" element={<SettingsPage goBack={goBack} />} />
        </Routes>
      </div>
    </> 
  );
}

export default EditorMain;