import { useEffect, useState } from "react";

import { useCurrentFile } from "../../context/CurrentFileContext";
import { useTagForm } from "../../context/TagFormContext";
import { getFile, saveMetadata } from "../../services/services";
import type { AudioFile } from "../../types/AudioFile";
import type { AudioUserTags } from "../../types/AudioUserTags";
import FormActionBtnDock from "./EditorFormActionBtnDock";

const EMPTY_TAGS: AudioUserTags = {
  title: "",
  album_artist: "",
  album: "",
  year: "",
  track_number: "",
  disc_number: "",
  genre: "",
};

function EditorSection() {
  const { fileInfo, updateCurrentFileValue } = useCurrentFile();
  const { userTags, setTagFormValue, setAllFormTags } = useTagForm();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadFileData = async () => {
      const filename = fileInfo?.full_path;

      if (!filename) return;

      setIsLoading(true);
      setStatusMessage("Loading audio file...");

      try {
        const response = await getFile(filename);
        const result = response.data?.result as AudioFile | undefined;

        if (!result) {
          throw new Error("No file data returned.");
        }

        const loadedTags = result.tags ?? EMPTY_TAGS;

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
        updateCurrentFileValue("tags", loadedTags);

        setAllFormTags({
          title: loadedTags.title ?? "",
          album_artist: loadedTags.album_artist ?? "",
          album: loadedTags.album ?? "",
          year: loadedTags.year ?? "",
          track_number: loadedTags.track_number ?? "",
          disc_number: loadedTags.disc_number ?? "",
          genre: loadedTags.genre ?? "",
        });

        setStatusMessage(null);
      } catch (error) {
        console.error("Error loading file data:", error);
        setStatusMessage("An error occurred while loading the selected file.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadFileData();
  }, [fileInfo?.full_path]);

  const handleSave = async () => {
    if (!fileInfo?.full_path) {
      setStatusMessage("No file is currently selected.");
      return;
    }

    setStatusMessage("Saving changes...");

    try {
      const response = await saveMetadata(fileInfo.full_path, userTags);
      setStatusMessage(response.data?.result ?? "Changes saved successfully.");
    } catch (error) {
      console.error("Error saving metadata:", error);
      setStatusMessage("Unable to save metadata changes.");
    }
  };

  const handleClear = () => {
    setAllFormTags(EMPTY_TAGS);
    updateCurrentFileValue("tags", EMPTY_TAGS);
    setStatusMessage(null);
  };

  return (
    <div className="position-relative pb-5">
      {isLoading && (
        <div className="alert alert-info">Loading audio file...</div>
      )}

      {statusMessage && !isLoading && (
        <div className="alert alert-secondary">{statusMessage}</div>
      )}

      <form className="pb-3">
        <div className="my-4">
          <label htmlFor="title" className="form-label">Title:</label>
          <input
            className="form-control"
            placeholder="Enter title"
            name="title"
            id="title"
            value={userTags.title ?? ""}
            onChange={(event) => setTagFormValue("title", event.target.value)}
          />
        </div>

        <div className="my-4">
          <label htmlFor="artist" className="form-label">Artist:</label>
          <input
            className="form-control"
            placeholder="Enter artist"
            name="artist"
            id="artist"
            value={userTags.album_artist ?? ""}
            onChange={(event) => setTagFormValue("album_artist", event.target.value)}
          />
        </div>

        <div className="my-4">
          <label htmlFor="year" className="form-label">Year:</label>
          <input
            className="form-control"
            placeholder="Enter year"
            name="year"
            id="year"
            value={userTags.year ?? ""}
            onChange={(event) => setTagFormValue("year", event.target.value)}
          />
        </div>

        <div className="my-4">
          <label htmlFor="genre" className="form-label">Genre:</label>
          <input
            className="form-control"
            placeholder="Enter genre"
            name="genre"
            id="genre"
            value={userTags.genre ?? ""}
            onChange={(event) => setTagFormValue("genre", event.target.value)}
          />
        </div>

        <div className="my-4">
          <label htmlFor="album" className="form-label">Album:</label>
          <input
            className="form-control"
            placeholder="Enter album"
            name="album"
            id="album"
            value={userTags.album ?? ""}
            onChange={(event) => setTagFormValue("album", event.target.value)}
          />
        </div>

        <div className="my-4">
          <label htmlFor="trackno" className="form-label">Track #:</label>
          <input
            className="form-control"
            placeholder="Enter track number"
            name="trackno"
            id="trackno"
            value={userTags.track_number ?? ""}
            onChange={(event) => setTagFormValue("track_number", event.target.value)}
          />
        </div>

        <div className="my-4">
          <label htmlFor="discno" className="form-label">Disc #:</label>
          <input
            className="form-control"
            placeholder="Enter disc number"
            name="discno"
            id="discno"
            value={userTags.disc_number ?? ""}
            onChange={(event) => setTagFormValue("disc_number", event.target.value)}
          />
        </div>

        <FormActionBtnDock onSave={() => void handleSave()} onClear={handleClear} />
      </form>
    </div>
  );
}

export default EditorSection;