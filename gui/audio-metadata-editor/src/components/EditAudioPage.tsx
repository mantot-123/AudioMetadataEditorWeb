import { useEffect, useState } from "react";
import { useCurrentFile } from "../context/CurrentFileContext";
import MetadataEditorForm from "./MetadataEditorForm";
import MetadataAlbumArt from "./MetadataAlbumArt";
import { NavLink, useNavigate } from "react-router";

function EditAudioPage({ goBack }: { goBack: Function }) {
  const navigate = useNavigate();
  const {fileInfo, setCurrentFileName} = useCurrentFile();

  useEffect(() => {
    if ((fileInfo.fileName ?? "") === "") {
      navigate("/");
    }
  }, [fileInfo])

  return (
    <div className="m-4">
      <h1>Edit Metadata</h1>
      <button className="btn btn-link" onClick={() => goBack()}>&lt;&lt; Back</button>
      <h3 className="my-3">Editing: {fileInfo.fileName}</h3>
      <div className="row">
        <div className="col-sm-8">
          <MetadataEditorForm />
        </div>
        <div className="col-sm-4">
          <MetadataAlbumArt />
        </div>
      </div>
    </div>
  );
}

export default EditAudioPage;