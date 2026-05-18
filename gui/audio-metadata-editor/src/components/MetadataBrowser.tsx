import { useState } from "react";
import { useCurrentFile } from "../context/CurrentFileContext";

interface MetadataBrowserProps {
  show: boolean,
  onConfirmSelection: Function,
  onCancel: Function
}

// display the browser as a modal
function MetadataBrowser({ show, onConfirmSelection, onCancel }: MetadataBrowserProps) {
  const { fileInfo } = useCurrentFile();
  const [selected, setSelected] = useState<object>({});

  if(!show) return null;

  return ( 
    <>
      <div className="modal-backdrop show"></div> {/* add a blackish backdrop that displays with the modal box */}
      <div className="modal show d-block" id="delFileModal"> {/* add a display-block property to the modal so it is shown when rendered */}
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title p-2">Metadata Browser</h4>
            </div>
            <div className="modal-body">
              <div className="p-2">
                <h5>Editing file: {fileInfo.fileName}</h5>
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Year</th>
                      <th>Genre</th>
                      <th>Album</th>
                      <th>Track #</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => {}}
                    >
                      <td>test title 1</td>
                      <td>test artist 1</td>
                      <td>test year 1</td>
                      <td>test genre 1</td>
                      <td>test album 1</td>
                      <td>test track number 1</td>
                      <td>test date 1</td>
                    </tr>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => { }}
                    >
                      <td>test title 2</td>
                      <td>test artist 2</td>
                      <td>test year 2</td>
                      <td>test genre 2</td>
                      <td>test album 2</td>
                      <td>test track number 2</td>
                      <td>test date 2</td>
                    </tr>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => { }}
                    >
                      <td>test title 3</td>
                      <td>test artist 3</td>
                      <td>test year 3</td>
                      <td>test genre 3</td>
                      <td>test album 3</td>
                      <td>test track number 3</td>
                      <td>test date 3</td>
                    </tr>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => { }}
                    >
                      <td>test title 4</td>
                      <td>test artist 4</td>
                      <td>test year 4</td>
                      <td>test genre 4</td>
                      <td>test album 4</td>
                      <td>test track number 4</td>
                      <td>test date 4</td>
                    </tr>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => { }}
                    >
                      <td>test title 5</td>
                      <td>test artist 5</td>
                      <td>test year 5</td>
                      <td>test genre 5</td>
                      <td>test album 5</td>
                      <td>test track number 5</td>
                      <td>test date 5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => { onConfirmSelection() }}>Confirm selection</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { onCancel()}}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </> 
  );
}

export default MetadataBrowser;