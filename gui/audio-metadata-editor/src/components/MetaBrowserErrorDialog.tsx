interface Props {
  show: boolean,
  message: string,
  onClose: Function
}

function MetaBrowserErrorDialog({ show, message, onClose }: Props) {
  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" id="metaBrowserErrorDialogModal"> {/* add a display-block property to the modal so it is shown when rendered */}
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Metadata Browser - Error</h4>
              <button type="button" className="btn-close" onClick={() => onClose()}></button>
            </div>
            <div className="modal-body">
              <p>{message ?  message : "An unknown error occurred while confirming metadata selection. Please try again later."}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => { onClose() }}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </> 
  );
}

export default MetaBrowserErrorDialog;