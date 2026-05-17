import AudioFilesList from "./AudioFilesList";

function StartPage() {
  return ( 
    <>
      <div className="m-4">
        <h1>Audio File Metadata Editor</h1>
      </div>
      <div className="d-flex flex-column">
        <div className="m-4">
          <AudioFilesList />
        </div>
      </div> 
    </>
  );
}

export default StartPage;