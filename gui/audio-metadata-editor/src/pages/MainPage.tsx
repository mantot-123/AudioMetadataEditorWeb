import EditorPage from "./editor/EditorPage";
import CoreNavBar from "../components/core/CoreNavBar";
import CoreSidebar from "../components/core/CoreSidebar";
import FilesTable from "../components/core/FilesTable";

import { useSidebar } from "../context/SidebarContext";

function MainPage() {
  const { sidebar, setSidebarEnabled } = useSidebar();
  return ( 
    <>
      <div className="d-flex flex-column vh-100 overflow-hidden">
        <CoreNavBar />
        <div className="d-flex flex-grow-1 overflow-auto">
          { sidebar.enabled && <CoreSidebar /> }
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
