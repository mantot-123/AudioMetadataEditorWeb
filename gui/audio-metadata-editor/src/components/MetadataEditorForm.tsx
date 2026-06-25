import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import axios from "axios";

import MetadataBrowserMain from "./MetadataBrowserMain";
import DeleteFileDialog from "./DeleteFileDialog";

import { useMetadata } from "../context/MetadataContext";
import { useCurrentFile } from "../context/CurrentFileContext";

import type { AudioUserTags } from "../types/AudioUserTags";
import type { AudioFileFullMetadata } from "../types/AudioFileFullMetadata";

type ReadMetadataResponse = {
  result: AudioFileFullMetadata
};

function MetadataEditorForm() {
  const { fileInfo, updateCurrentFile } = useCurrentFile();

  const {
    metadata,
    setTitle,
    setArtist,
    setYear,
    setGenre,
    setAlbum,
    setTrackNumber,
    setDiscNumber
  } = useMetadata();

  const [newFileName, setNewFileName] = useState<string>(fileInfo?.name ?? "");
  const [showMetaBrowser, setShowMetaBrowser] = useState<boolean>(false);
  const [showFileDelModal, setShowFileDelModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDelDialogOpen = (): void => {
    setShowFileDelModal(true);
  };

  const onFileDeleteYes = (): void => {
    // TODO delete the file from disk
    setShowFileDelModal(false);
  };

  const onFileDeleteNo = (): void => {
    setShowFileDelModal(false);
  };

  // close the metadata browser
  const onMetaBrowserClose = () => {
    setShowMetaBrowser(false);
  };

  useEffect(() => {
    const loadMetadata = async (): Promise<void> => {
      const filename = fileInfo?.rel_path;

      if(!filename) return;

      try {
        setIsLoading(true);

        const response = await axios.get<ReadMetadataResponse>("/read-metadata", {
          params: { filename }
        });

        const tags = response.data.result.tags;

        setTitle(tags.title);
        setArtist(tags.album_artist);
        setYear(tags.year);
        setGenre(tags.genre);
        setAlbum(tags.album);
        setTrackNumber(tags.track_number?.track_number);
        setDiscNumber(tags.disc_number?.disc_number);

      } catch(error) {
        console.error("Unable to read file metadata");
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, []);

  return (
    <>
      <button 
        className="btn btn-dark d-flex gap-2 align-items-center"
        onClick={() => setShowMetaBrowser(true)}
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
            value={fileInfo?.name ?? ""}
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
          <button
            type="button"
            className="btn btn-outline-danger d-flex gap-2 align-items-center"
            onClick={onDelDialogOpen}>
            <Icon icon="material-symbols:delete-outline" fontSize="20" />
            Delete file
          </button>
        </div>
      </form>

      <MetadataBrowserMain 
        show={showMetaBrowser}
        onClose={onMetaBrowserClose}
      />

      {/* DELETION DIALOG */}
      <DeleteFileDialog
        show={showFileDelModal}
        fileName={fileInfo?.name ?? ""}
        onDeleteYes={onFileDeleteYes}
        onDeleteNo={onFileDeleteNo}
      />
    </> 
  );
}

export default MetadataEditorForm;
