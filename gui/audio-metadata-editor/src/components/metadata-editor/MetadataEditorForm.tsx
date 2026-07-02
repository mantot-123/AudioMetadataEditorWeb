import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import axios from "axios";

import MetadataBrowserMain from "../metadata-browser/MetadataBrowserMain";
import DeleteFileDialog from "./DeleteFileDialog";

import { useCurrentFile } from "../../context/CurrentFileContext";
import { useTagForm } from "../../context/TagFormContext";

import type { AudioFile } from "../../types/AudioFile";

type ReadMetadataResponse = { 
  error: string;
  result: AudioFile;
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
    updateCurrentFileValue,
  } = useCurrentFile();

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
      const filename = fileInfo?.full_path;

      if(!filename) return;

      try {
        setIsLoading(true);
        setStatusMsg((prev) =>
          isResultMessage(prev)
            ? prev!
            : { type: FormStatusMsgType.Info, msg: "Loading audio file..." }
        );

        const response = await axios.get<ReadMetadataResponse>("/get-file", {
          params: { filename }
        });

        const result = response.data.result;

        const tags = result.tags;
        
        updateCurrentFileValue("name", result.name);
        updateCurrentFileValue("full_path", result.full_path);
        updateCurrentFileValue("size", result.size);
        updateCurrentFileValue("file_ext", result.file_ext);
        updateCurrentFileValue("mime_type", result.mime_type);
        updateCurrentFileValue("modify_time", result.modify_time);
        updateCurrentFileValue("tag_sys", result.tag_sys);
        updateCurrentFileValue("format", result.format);
        updateCurrentFileValue("duration", result.duration);
        updateCurrentFileValue("bitrate", result.bitrate);
        updateCurrentFileValue("channels", result.channels);
        updateCurrentFileValue("sample_rate", result.sample_rate);
        updateCurrentFileValue("tags", tags);

        setTagFormValue("title", tags.title);
        setTagFormValue("album_artist", tags.album_artist);
        setTagFormValue("year", tags.year);
        setTagFormValue("genre", tags.genre);
        setTagFormValue("album", tags.album);
        setTagFormValue("track_number", tags.track_number);
        setTagFormValue("disc_number", tags.disc_number);
        
        setIsLoadingSuccess(true);

        setStatusMsg((prev) => (isResultMessage(prev) ? prev : null));

      } catch(error) {
        setStatusMsg({
          type: FormStatusMsgType.Error,
          msg: "An error occurred while reading your file"
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
        filename: fileInfo?.full_path,
        new_tags: {
          title: userTags.title,
          album_artist: userTags.album_artist,
          album: userTags.album,
          year: userTags.year,
          track_number: userTags.track_number,
          disc_number: userTags.disc_number,
          genre: userTags.genre,
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
            {<p><strong>Info:</strong> {statusMsg?.msg ?? "Loading..."}</p>}
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
