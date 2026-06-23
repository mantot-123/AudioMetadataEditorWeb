import StartPage from "./StartPage";
import EditAudioPage from "./EditAudioPage";
import { useCurrentFile } from "../context/CurrentFileContext";
import { useMetadata } from "../context/MetadataContext";
import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router";

function EditorMainPage() {
  const navigate = useNavigate();

  const {
    fileInfo, 
    setCurrentFileName, 
    resetCurrentFile
  } = useCurrentFile();

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
    setDateReleased,
    resetMetadata
  } = useMetadata();

  useEffect(() => {
    if(location.pathname !== "/edit") {
      resetCurrentFile();
      resetMetadata();
    }
  }, [location.pathname, resetCurrentFile, resetMetadata])

  const goBack = () => {
    resetCurrentFile();
    resetMetadata();
    navigate("/");
  };

  return ( 
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/edit" element={<EditAudioPage goBack={goBack}/>} />
        </Routes>
      </div>
    </> 
  );
}

export default EditorMainPage;