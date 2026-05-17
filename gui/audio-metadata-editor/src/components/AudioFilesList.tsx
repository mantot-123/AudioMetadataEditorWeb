import { Icon } from "@iconify/react";
import DeleteFileDialog from "./DeleteFileDialog";
import { useState } from "react";

function AudioFilesList() {
  const [showFileDelModal, setShowFileDelModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>("<file name here>");

  const onDelDialogOpen = (): void => {
    setShowFileDelModal(true);
  };

  const onFileDeleteYes = (): void => {
    setShowFileDelModal(false);
  };

  const onFileDeleteNo = (): void => {
    setShowFileDelModal(false);
  };

  return ( 
    <>
      <h3>Your files</h3>
      <div className="d-flex gap-2 align-items-center">
        <div className="my-2 btn-group">
          {/* icon buttons with svg */}
          <div className="btn btn-outline-dark">
            <Icon icon="ri:file-add-line" />
          </div>
          <div className="btn btn-outline-dark">
            <Icon icon="mdi:folder-add-outline" />
          </div>
        </div>
        <button 
          type="button"
          className="btn text-danger"
          onClick={() => {}}
        >Clear all files</button>
      </div>

      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>File name</th>
            <th>File size</th>
            <th>File type</th>
            <th>Date modified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            style={ {cursor: "pointer"} }
            onClick={() => {}}
          >
            <td>onestop.wav</td>
            <td>3.67MB</td>
            <td>Waveform Audio File</td>
            <td>2025-10-25 12:00:00</td>
            <td>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-dark">
                  <Icon icon="mdi:file-edit-outline" fontSize="20" />
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={onDelDialogOpen}>
                  <Icon icon="material-symbols:delete-outline" fontSize="20" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* DELETION DIALOG */}
      <DeleteFileDialog 
        show={showFileDelModal}
        fileName={selectedFile} 
        onDeleteYes={onFileDeleteYes}
        onDeleteNo={onFileDeleteNo}
      />
    </>
  );
}

export default AudioFilesList;