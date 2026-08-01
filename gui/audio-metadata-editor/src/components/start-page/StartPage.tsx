import FilesTable from "../core/FilesTable";

function StartPage() {
  return ( 
    <>
      <div className="d-flex vh-100 overflow-hidden">
        <div className="flex-grow-1 col-md-7">
          <FilesTable />
        </div>
        <div className="col-md-5 p-4">
          <h1>Editing form here...</h1>
          <p>Placeholder content here...</p>
        </div>
      </div> 
    </>
  );
}

export default StartPage;