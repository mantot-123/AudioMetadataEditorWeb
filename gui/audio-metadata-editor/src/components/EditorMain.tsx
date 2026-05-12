import AudioFilesList from "./AudioFilesList";
import MetadataBrowser from "./MetadataBrowser";
import MetadataEditorForm from "./MetadataEditorForm";
function EditorMain() {
  return ( 
    <>
      <div className="container">
        <div className="m-4 d-flex flex-md-row flex-column">
          <div className="m-5 flex-grow-2">
            <AudioFilesList />
          </div>
          <div className="m-5 flex-grow-1">
            <MetadataEditorForm />
          </div>
        </div>
      </div>
    </> 
  );
}

export default EditorMain;