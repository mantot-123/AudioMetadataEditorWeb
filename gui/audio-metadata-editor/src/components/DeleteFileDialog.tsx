import { useCurrentFile } from "../context/CurrentFileContext";

interface DeleteFileDialogProps {
  show: boolean,
  fileName: string,
  onDeleteYes(): void,
  onDeleteNo(): void
}

function DeleteFileDialog({ show, fileName, onDeleteYes, onDeleteNo }: DeleteFileDialogProps) {
  if(!show) return null;

  return (
    <>
      <div className="modal-backdrop show"></div> {/* add a blackish backdrop that displays with the modal box */}
      <div className="modal show d-block" id="delFileModal"> {/* add a display-block property to the modal so it is shown when rendered */}
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Delete file '{fileName}'</h4>
            </div>
            <div className="modal-body">
              Are you sure you want to permanently delete the file '{fileName}? This action cannot be undone.
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={onDeleteYes}>Yes</button>
              <button type="button" className="btn btn-light" onClick={onDeleteNo}>No</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteFileDialog;