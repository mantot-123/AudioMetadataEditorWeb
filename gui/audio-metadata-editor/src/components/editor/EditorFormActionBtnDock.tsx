type EditorFormActionBtnDockProps = {
  onSave: () => void | Promise<void>;
  onClear: () => void;
};

function EditorFormActionBtnDock({ onSave, onClear }: EditorFormActionBtnDockProps) {
  return (
    <div
      className="position-sticky bottom-0 mt-4 py-3 border-top bg-white"
      style={{ zIndex: 10 }}
    >
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-primary" onClick={() => void onSave()}>
          Save changes
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onClear}>
          Clear input fields
        </button>
      </div>
    </div>
  );
}

export default EditorFormActionBtnDock;