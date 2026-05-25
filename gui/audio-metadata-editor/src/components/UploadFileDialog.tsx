interface UploadFileDialogProps {
  show: boolean;
  onClose: () => void;
  onUpload: () => void;
}

function UploadFileDialog({show, onClose, onUpload}: UploadFileDialogProps) {
  if (!show) return null;

  const handleSubmit = () => {
    // TODO handle file submission here

    // run event handler after upload is finished
    onUpload();
  };

  return (
    <>
      <div className="modal-backdrop show" />
      <div className="modal modal-lg show d-block" id="uploadFileModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Import files</h4>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <p className="text-muted">Choose one or more audio files to add to your library.</p>
                <p className="text-muted">Your files will be copied at PUT_DIRECTORY_HERE.</p>
                <label htmlFor="audioFiles" className="form-label">Audio file</label>
                <input
                  className="form-control"
                  type="file"
                  id="audioFiles"
                  name="audioFiles"
                  accept="audio/*,.wav,.mp3,.flac,.m4a,.ogg"
                  multiple
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add files
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadFileDialog;