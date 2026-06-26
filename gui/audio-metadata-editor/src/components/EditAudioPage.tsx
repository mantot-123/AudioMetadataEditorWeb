import { useEffect, useState } from "react";
import { useCurrentFile } from "../context/CurrentFileContext";
import MetadataEditorForm from "./MetadataEditorForm";
import MetadataViewTable from "./MetadataViewTable";
import MetadataAlbumArt from "./MetadataAlbumArt";
import { useNavigate } from "react-router";

function EditAudioPage({ goBack }: { goBack(): void }) {
  const navigate = useNavigate();
  const { fileInfo } = useCurrentFile(); 
  const [mode, setMode] = useState<"view" | "edit">("edit");

  useEffect(() => {
    if (!fileInfo?.name) {
      navigate("/");
    }
  }, [fileInfo, navigate]);

  return (

    <div className="m-4">
      <h1>Edit Metadata</h1>
      <button className="btn btn-link" onClick={() => goBack()}>&lt;&lt; Back</button>
      <h3 className="my-3">Editing: {fileInfo?.rel_path}</h3>
      <div className="row">
        <div className="col-sm-8">
          <div className="btn-group">
            <button 
              className={`btn ${mode === "view" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("view")}
            >
              View file info
            </button>
            <button 
              className={`btn ${mode === "edit" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("edit")}
            >
              Edit user tags
            </button>
          </div>
          <div className="my-5">
            {mode === "edit" ? <MetadataEditorForm /> : <MetadataViewTable />}
          </div>
        </div>
        <div className="col-sm-4">
          <MetadataAlbumArt />
        </div>
      </div>
    </div>
  );
}

export default EditAudioPage;
