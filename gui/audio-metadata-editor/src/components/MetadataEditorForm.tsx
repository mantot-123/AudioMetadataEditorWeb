import { Icon } from "@iconify/react";
import { useState } from "react";

import MetadataBrowserMain from "./MetadataBrowserMain";

import { useMetadata } from "../context/MetadataContext";
import { useCurrentFile } from "../context/CurrentFileContext";

function MetadataEditorForm() {
  const { fileInfo, setCurrentFileName } = useCurrentFile();

  const {
    metadata,
    setId,
    setTitle,
    setArtist,
    setYear,
    setGenre,
    setAlbum,
    setTrackNumber,
    setDiscNumber,
    setDateReleased
  } = useMetadata();

  const [newFileName, setNewFileName] = useState<string>(fileInfo.fileName);
  const [showBrowser, setShowBrowser] = useState<boolean>(false);
  
  // close the metadata browser
  const onClose = () => {
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
          <input 
            className="form-control" 
            placeholder="Enter file name" 
            name="fnameinput" 
            id="fnameinput" 
            onChange={(e) => setNewFileName(e.target.value)}
            value={newFileName ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="title" className="form-label">Title:</label>
          <input 
            className="form-control" 
            placeholder="Enter title" 
            name="title" 
            id="title" 
            onChange={(e) => setTitle(e.target.value)}
            value={metadata.title ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="artist" className="form-label">Artist:</label>
          <input 
            className="form-control" 
            placeholder="Enter artist" 
            name="artist" 
            id="artist" 
            onChange={(e) => setArtist(e.target.value)}
            value={metadata.artist ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="year" className="form-label">Year:</label>
          <input 
            className="form-control" 
            placeholder="Enter year" 
            name="year" 
            id="year" 
            onChange={(e) => setYear(e.target.value)}
            value={metadata.year ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="genre" className="form-label">Genre:</label>
          <input 
            className="form-control" 
            placeholder="Enter genre" 
            name="genre" 
            id="genre" 
            onChange={(e) => setGenre(e.target.value)}
            value={metadata.genre ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="album" className="form-label">Album:</label>
          <input 
            className="form-control" 
            placeholder="Enter album" 
            name="album" 
            id="album" 
            onChange={(e) => setAlbum(e.target.value)}
            value={metadata.album ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="trackno" className="form-label">Track #:</label>
          <input 
            className="form-control" 
            placeholder="Enter track number" 
            name="trackno" 
            id="trackno" 
            onChange={(e) => setTrackNumber(e.target.value)}
            value={metadata.trackNumber ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="discno" className="form-label">Disc #:</label>
          <input 
            className="form-control" 
            placeholder="Enter disc number" 
            name="discno" 
            id="discno" 
            onChange={(e) => setDiscNumber(e.target.value)}
            value={metadata.discNumber ?? ""}
          />
        </div>
        <div className="my-4">
          <label htmlFor="art" className="form-label">Album art:</label>
          <input 
            className="form-control" 
            type="file" 
            id="art" 
            name="art" 
          />
        </div>
        <div className="my-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Save changes</button>
          <button type="reset" className="btn">Clear</button>
        </div>
      </form>

      <MetadataBrowserMain 
        show={showBrowser}
        onClose={onClose}
      />
    </> 
  );
}

export default MetadataEditorForm;