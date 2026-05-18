import { Icon } from "@iconify/react";
import { useState } from "react";

import MetadataBrowser from "./MetadataBrowser";

import { useCurrentFile } from "../context/CurrentFileContext";

function MetadataEditorForm() {
  const { fileInfo, setFileName } = useCurrentFile();

  const [showBrowser, setShowBrowser] = useState<boolean>(false);

  const [fNameInput, setFNameInput] = useState<string>(fileInfo.fileName);
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [trackNo, setTrackNo] = useState<string>("");
  
  const onConfirmSelection = (selected: object) => {
    setShowBrowser(true);
  };

  const onCancel = () => {
    setShowBrowser(false);
  };

  return (
    <>
      <button 
        className="btn btn-light d-flex gap-2 align-items-center"
        onClick={() => setShowBrowser(true)}
      >
        <Icon icon="material-symbols:search" />
        Search in metadata browser...
      </button>
      <form>
        <div className="my-4">
          <label htmlFor="filename" className="form-label">File name:</label>
          <input className="form-control" placeholder="Enter file name" name="fnameinput" id="fnameinput" />
        </div>
        <div className="my-4">
          <label htmlFor="title" className="form-label">Title:</label>
          <input className="form-control" placeholder="Enter title" name="title" id="title" />
        </div>
        <div className="my-4">
          <label htmlFor="artist" className="form-label">Artist:</label>
          <input className="form-control" placeholder="Enter artist" name="artist" id="artist" />
        </div>
        <div className="my-4">
          <label htmlFor="year" className="form-label">Year:</label>
          <input className="form-control" placeholder="Enter year" name="year" id="year" />
        </div>
        <div className="my-4">
          <label htmlFor="genre" className="form-label">Genre:</label>
          <input className="form-control" placeholder="Enter genre" name="genre" id="genre" />
        </div>
        <div className="my-4">
          <label htmlFor="album" className="form-label">Album:</label>
          <input className="form-control" placeholder="Enter album" name="album" id="album" />
        </div>
        <div className="my-4">
          <label htmlFor="album" className="form-label">Track #:</label>
          <input className="form-control" placeholder="Enter track number" name="trackno" id="trackno" />
        </div>
        <div className="my-4">
          <label htmlFor="art" className="form-label">Album art:</label>
          <input className="form-control" type="file" id="art" name="art" />
        </div>
        <div className="my-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Save changes</button>
          <button type="reset" className="btn">Clear</button>
        </div>
      </form>

      <MetadataBrowser
        show={showBrowser}
        onConfirmSelection={onConfirmSelection}
        onCancel={onCancel}
      />
    </> 
  );
}

export default MetadataEditorForm;