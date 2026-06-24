import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import UploadFileDialog from "./UploadFileDialog";
import SettingsDialog from "./SettingsDialog";
import { useCurrentFile } from "../context/CurrentFileContext";

type AudioFile = {
  name: string;
  rel_path: string;
  full_path: string;
  size: number;
  file_ext: string;
  mime_type: string | null;
  modify_time: number;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  /* 
  1 KB = 1024 bytes
  1 MB = 1024^2 bytes
  1 GB = 1024^3 bytes
  1 TB = 1024^4 bytes
  */
  const units = ["bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatModifiedTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

const formatFileType = (file: AudioFile): string => {
  return file.mime_type ?? file.file_ext.replace(".", "").toUpperCase();
};

function AudioFilesTable() {
  const navigate = useNavigate();
  const { setCurrentFileName } = useCurrentFile();
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState<boolean>(false);
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFiles = async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.get<AudioFile[]>("/all-files");
      setFiles(response.data);
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setErrorMessage(error.response?.data?.error ?? error.message);
      } else {
        setErrorMessage("Unable to load audio files.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadFiles();
  }, []);

  const onUpload = () => {
    void loadFiles();
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
          {isLoading && (
            <tr>
              <td colSpan={4} className="text-muted">Loading files...</td>
            </tr>
          )}

          {!isLoading && errorMessage && (
            <tr>
              <td colSpan={4} className="text-danger">{errorMessage}</td>
            </tr>
          )}

          {!isLoading && !errorMessage && files.length === 0 && (
            <tr>
              <td colSpan={4} className="text-muted">No audio files found.</td>
            </tr>
          )}

          {!isLoading && !errorMessage && files.map((file) => (
            <tr
              key={file.name}
              style={ {cursor: "pointer"} }
              onClick={() => {
                setCurrentFileName(file.name);
                navigate("/edit");
              }}
            >
              <td>{file.rel_path}</td>
              <td>{formatFileSize(file.size)}</td>
              <td>{formatFileType(file)}</td>
              <td>{formatModifiedTime(file.modify_time)}</td>
            </tr>
          ))}
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
