import StartPage from "./start-page/StartPage";
import EditAudioPage from "./editor-main/EditAudioPage";
import { useCurrentFile } from "../context/CurrentFileContext";
import { useMetadata } from "../context/MetadataContext";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router";

function MainPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const { updateCurrentFile } = useCurrentFile();

  const { resetMetadata } = useMetadata();

  useEffect(() => {
    if(location.pathname !== "/edit") {
      updateCurrentFile(null);
      resetMetadata();
    }
  }, [location.pathname, updateCurrentFile, resetMetadata])

  const goBack = () => {
    updateCurrentFile(null);
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

export default MainPage;
