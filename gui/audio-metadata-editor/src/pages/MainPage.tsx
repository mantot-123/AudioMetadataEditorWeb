import StartPage from "../components/start-page/StartPage";
import EditorPage from "./EditorPage";
import CoreNavBar from "../components/core/CoreNavBar";
import FilesTable from "../components/core/FilesTable";
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
      <div className="d-flex flex-column vh-100 overflow-hidden">
        <CoreNavBar />
        <div className="d-flex flex-grow-1 overflow-auto">
          <div className="flex-grow-1 col-md-8">
            <FilesTable />
          </div>
          <div className="flex-grow-1 col-md-4 overflow-auto" style={{ borderLeft: "1px solid #ccc" }}>
            <EditorPage />
          </div>
        </div>
      </div>
    </> 
  );
}

export default MainPage;
