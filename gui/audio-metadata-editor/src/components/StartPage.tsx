import AudioFilesTable from "./AudioFilesTable";

function StartPage() {
  return ( 
    <>
      <h1 className="m-4">Audio File Metadata Editor</h1>
      <div className="d-flex flex-column">
        <AudioFilesTable />
      </div> 
    </>
  );
}

export default StartPage;