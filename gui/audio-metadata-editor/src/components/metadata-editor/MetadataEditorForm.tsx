import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import axios from "axios";

import MetadataBrowserMain from "../metadata-browser/MetadataBrowserMain";
import DeleteFileDialog from "./DeleteFileDialog";

import { useMetadata } from "../../context/MetadataContext";
import { useCurrentFile } from "../../context/CurrentFileContext";
import { useTagForm } from "../../context/TagFormContext";

import type { AudioFileFullMetadata } from "../../types/AudioFileFullMetadata";
import type { AudioUserTags } from "../../types/AudioUserTags";

type ReadMetadataResponse = { 
  error: string;
  result: AudioFileFullMetadata;
}; 

const FormStatusMsgType = {
  Info: 0,
  Success: 1,
  Error: 2
};

type FormStatusMsgType = typeof FormStatusMsgType[keyof typeof FormStatusMsgType];

type FormStatusMessage = {
  type: number;
  msg: string;
}

function MetadataEditorForm() {
  const { 
    fileInfo, 
    updateCurrentFile 
  } = useCurrentFile();

  const {
    metadata,
    setAudioFileMetadataValue,
    setUserTagValue,
  } = useMetadata();

  const {
    userTags,
    setTagFormValue
  } = useTagForm();

  const [showMetaBrowser, setShowMetaBrowser] = useState<boolean>(false);
  const [showFileDelModal, setShowFileDelModal] = useState<boolean>(false);
  const [isLoadingSuccess, setIsLoadingSuccess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<FormStatusMessage | null>(null);
  const [isFormProcessing, setIsFormProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [newUserTags, setNewUserTags] = useState<AudioUserTags | null>(null);

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
        setStatusMsg((prev) =>
          isResultMessage(prev)
            ? prev!
            : { type: FormStatusMsgType.Info, msg: "Loading audio file..." }
        );

        const response = await axios.get<ReadMetadataResponse>("/read-metadata", {
          params: { filename }
        });

        const result = response.data.result;
        const tags = result.tags;

        setAudioFileMetadataValue("filepath", result.filepath);
        setAudioFileMetadataValue("format", result.format);
        setAudioFileMetadataValue("duration", result.duration);
        setAudioFileMetadataValue("bitrate", result.bitrate);
        setAudioFileMetadataValue("channels", result.channels);
        setAudioFileMetadataValue("sample_rate", result.sample_rate);
        setAudioFileMetadataValue("tags", tags);

        setTagFormValue("title", tags.title);
        setTagFormValue("album_artist", tags.album_artist);
        setTagFormValue("year", tags.year);
        setTagFormValue("genre", tags.genre);
        setTagFormValue("album", tags.album);
        setTagFormValue("track_number", tags.track_number);
        setTagFormValue("disc_number", tags.disc_number);

        setUserTagValue("title", tags.title);
        setUserTagValue("album_artist", tags.album_artist);
        setUserTagValue("year", tags.year);
        setUserTagValue("genre", tags.genre);
        setUserTagValue("album", tags.album);
        setUserTagValue("track_number", tags.track_number);
        setUserTagValue("disc_number", tags.disc_number);
        
        setIsLoadingSuccess(true);
        setStatusMsg((prev) => (isResultMessage(prev) ? prev : null));

      } catch(error) {
        setStatusMsg({
          type: FormStatusMsgType.Error,
          msg: (error as any).response.data["error"] || "Unable to read file metadata"
        });

        setIsLoadingSuccess(false);

      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, []);

  // tag change handler
  const onSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsFormProcessing(true);
      setStatusMsg({type: FormStatusMsgType.Info, msg: "Saving changes..."});

      const tagChangeResponse = await axios.post("/apply-metadata", {
        filename: fileInfo?.rel_path,
        new_tags: {
          title: metadata.tags.title,
          album_artist: metadata.tags.album_artist,
          album: metadata.tags.album,
          year: metadata.tags.year,
          track_number: metadata.tags.track_number,
          disc_number: metadata.tags.disc_number,
          genre: metadata.tags.genre,
        }
      });
      
      const tagChangeMsg: string = tagChangeResponse.data.result as string;
      setStatusMsg({type: FormStatusMsgType.Success, msg: tagChangeMsg});

    } catch(error) {
      setStatusMsg({type: FormStatusMsgType.Error, msg: (error as any).response.data["result"] as string})
    } finally {
      setIsFormProcessing(false);
    }
  };


  const isResultMessage = (msg: FormStatusMessage | null): boolean =>
  msg?.type === FormStatusMsgType.Success || msg?.type === FormStatusMsgType.Error;

  return (
    <>
      { isLoading &&
        <>
          <div className="alert alert-info">
            {<p><strong>Info:</strong>{statusMsg?.msg ?? "Loading..."}</p>}
          </div>
        </>
      }

      { (!isLoading && !isLoadingSuccess) &&
        <>
          <div className="alert alert-danger">
            <p>{statusMsg?.msg ?? "An unknown error occurred."}</p>
          </div>
        </>
      }

      { (!isLoading && isLoadingSuccess) &&
      <>
        {((isFormProcessing || isResultMessage(statusMsg)) && statusMsg) &&
          <div className={`alert 
            ${statusMsg?.type === FormStatusMsgType.Success ? "alert-success" 
            : statusMsg?.type === FormStatusMsgType.Error ? "alert-danger"
            : "alert-info"}`}>
              {statusMsg?.msg ?? ""}
          </div>
        }

        <button
          className="btn btn-dark d-flex gap-2 align-items-center"
          onClick={() => setShowMetaBrowser(true)}
        >
          <Icon icon="material-symbols:search" />
          Search in metadata browser...
        </button>

        <form id="edit-tags-form" onSubmit={onSaveChanges} method="POST">
          <div className="my-4">
            <label htmlFor="title" className="form-label">Title:</label>
            <input 
              className="form-control" 
              placeholder="Enter title" 
              name="title" 
              id="title" 
              onChange={(e) => setTagFormValue("title", e.target.value)}
              value={userTags.title ?? ""}
            />
          </div>
          <div className="my-4">
            <label htmlFor="artist" className="form-label">Artist:</label>
            <input 
              className="form-control" 
              placeholder="Enter artist" 
              name="artist" 
              id="artist" 
              onChange={(e) => setTagFormValue("album_artist", e.target.value)}
              value={userTags.album_artist ?? ""}
            />
          </div>
          <div className="my-4">
            <label htmlFor="year" className="form-label">Year:</label>
            <input 
              className="form-control" 
              placeholder="Enter year" 
              name="year" 
              id="year" 
              onChange={(e) => setTagFormValue("year", e.target.value)}
              value={userTags.year ?? ""}
            />
          </div>
          <div className="my-4">
            <label htmlFor="genre" className="form-label">Genre:</label>
            <input 
              className="form-control" 
              placeholder="Enter genre" 
              name="genre" 
              id="genre" 
              onChange={(e) => setTagFormValue("genre", e.target.value)}
              value={userTags.genre ?? ""}
            />
          </div>
          <div className="my-4">
            <label htmlFor="album" className="form-label">Album:</label>
            <input 
              className="form-control" 
              placeholder="Enter album" 
              name="album" 
              id="album" 
              onChange={(e) => setTagFormValue("album", e.target.value)}
              value={userTags.album ?? ""}
            />
          </div>
          <div className="my-4">
            <label htmlFor="trackno" className="form-label">Track #:</label>
            <input 
              className="form-control" 
              placeholder="Enter track number" 
              name="trackno" 
              id="trackno" 
              onChange={(e) => setTagFormValue("track_number", e.target.value)}
              value={userTags.track_number ?? ""}
            />
          </div>
          <div className="my-4">
            <label htmlFor="discno" className="form-label">Disc #:</label>
            <input 
              className="form-control" 
              placeholder="Enter disc number" 
              name="discno" 
              id="discno" 
              onChange={(e) => setTagFormValue("disc_number", e.target.value)}
              value={userTags.disc_number ?? ""}
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
      }
    </> 
  );
}

export default MetadataEditorForm;
