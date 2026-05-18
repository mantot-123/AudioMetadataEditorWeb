import AudioFilesList from "./AudioFilesList";

function StartPage() {
  return ( 
    <>
      <h1 className="m-4">Audio File Metadata Editor</h1>
      <div className="d-flex flex-column">
        <AudioFilesList />
      </div> 
    </>
  );
}

export default StartPage;