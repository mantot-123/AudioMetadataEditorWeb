import AudioFilesList from "./AudioFilesList";
import StartPage from "./StartPage";
import EditAudioPage from "./EditAudioPage";
import SettingsPage from "./SettingsPage";
import { useCurrentFile } from "../context/CurrentFileContext";
import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router";

function EditorMain() {
  const navigate = useNavigate();

  const {currentFile, setCurrentFileName} = useCurrentFile();

  const goBack = () => {
    setCurrentFileName("");
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