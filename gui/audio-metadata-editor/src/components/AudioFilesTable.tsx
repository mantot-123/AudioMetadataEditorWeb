import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router";

import UploadFileDialog from "./UploadFileDialog";
import SettingsDialog from "./SettingsDialog";
import { useCurrentFile } from "../context/CurrentFileContext";

function AudioFilesTable() {
  const navigate = useNavigate();
  const {fileInfo, setCurrentFileName} = useCurrentFile();
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState<boolean>(false);

  const onUpload = () => {
    // TODO refresh the files list table
  };

  return ( 
    <div className="my-2 mx-4">
      <h3>Your files</h3>
      <div className="d-flex gap-2 align-items-center justify-content-between">
        <div className="my-2">
          {/* icon buttons with svg */}
          <button 
            className="btn btn-outline-dark d-flex gap-2 align-items-center"
            onClick={() => setShowUploadDialog(true)}
            >
            <Icon icon="ri:file-add-line" fontSize="22"/>
            Add file
          </button>
        </div>
        <div className="my-2">
          <button 
            className="btn btn-outline-dark d-flex gap-2 align-items-center"
            onClick={() => setShowSettingsDialog(true)}>
            <Icon icon="mdi:settings" fontSize="22" />
          </button>
        </div>
      </div>

      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>File name</th>
            <th>File size</th>
            <th>File type</th>
            <th>Date modified</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            style={ {cursor: "pointer"} }
            onClick={() => {
              setCurrentFileName("<file name here>");
              navigate("/edit");
            }}
          >
            <td>onestop.wav</td>
            <td>3.67MB</td>
            <td>Waveform Audio File</td>
            <td>2025-10-25 12:00:00</td>
          </tr>
        </tbody>
      </table>

      <UploadFileDialog
        show={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={onUpload}
      />

      <SettingsDialog 
        show={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
      />

    </div>
  );
}

export default AudioFilesTable;