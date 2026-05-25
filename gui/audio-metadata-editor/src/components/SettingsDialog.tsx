interface SettingsDialog {
  show: boolean,
  onClose(): void
}

function SettingsPage({ show, onClose }: SettingsDialog) {
  if(!show) return null;
 
  return ( 
    <>
      <div className="modal-backdrop show" />
      <div className="modal modal-lg show d-block" id="uploadFileModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Settings</h4>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              The settings page is still under construction. Stay tuned :D
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;