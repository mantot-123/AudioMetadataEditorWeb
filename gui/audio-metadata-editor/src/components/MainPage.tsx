import StartPage from "./start-page/StartPage";
import EditAudioPage from "./metadata-editor/EditAudioPage";
import { useCurrentFile } from "../context/CurrentFileContext";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router";

function MainPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const { updateCurrentFileValue, resetCurrentFile } = useCurrentFile();

  useEffect(() => {
    if(location.pathname !== "/edit") {
      resetCurrentFile();
    }
  }, [location.pathname, updateCurrentFileValue]);

  const goBack = () => {
    resetCurrentFile();
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
