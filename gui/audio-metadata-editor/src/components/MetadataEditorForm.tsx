function MetadataEditorForm() {
  return ( 
    <>
      <h2>Edit metadata</h2>
      <form>
        <div className="my-4">
          <label htmlFor="title" className="form-label">Title:</label>
          <input className="form-control" placeholder="Enter title" name="title" id="title" />
        </div>
        <div className="my-4">
          <label htmlFor="artist" className="form-label">Artist:</label>
          <input className="form-control" placeholder="Enter artist" name="artist" id="artist" />
        </div>
        <div className="my-4">
          <label htmlFor="year" className="form-label">Year:</label>
          <input className="form-control" placeholder="Enter year" name="year" id="year" />
        </div>
        <div className="my-4">
          <label htmlFor="album" className="form-label">Album:</label>
          <input className="form-control" placeholder="Enter album" name="album" id="album" />
        </div>
        <div className="my-4">
          <label htmlFor="art" className="form-label">Album art:</label>
          <input className="form-control" type="file" id="art" name="art" />
        </div>
        <div className="my-4">
          <button type="submit" className="btn btn-primary">Save changes</button>
          <button type="reset" className="btn">Clear</button>
        </div>
      </form>
    </> 
  );
}

export default MetadataEditorForm;