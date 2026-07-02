import { useState } from "react";

import { useCurrentFile } from "../../context/CurrentFileContext";
import { useTagForm } from "../../context/TagFormContext";

import MetadataBrowserTable from "./MetadataBrowserTable";
import MetaBrowserErrorDialog from "./MetaBrowserErrorDialog";

import type { AudioUserTags } from "../../types/AudioUserTags";

interface MetadataBrowserProps {
  show: boolean,
  onClose(): void,
}


// display the browser as a modal
function MetadataBrowserMain({ show, onClose }: MetadataBrowserProps) {
  const { fileInfo } = useCurrentFile();
  const [isError, setIsError] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<AudioUserTags | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  const {
    setAllFormTags
  } = useTagForm();

  // get row from the metadata table that was selected
  const onRowSelect = (d: AudioUserTags) => {
    if(selected !== d) return setSelected(d);
    setSelected(null);
  }

  const onConfirm = (d: AudioUserTags) => setAllFormTags(d);

  if(!show) return null;

  return ( 
    <>
      <div className="modal-backdrop show"></div> {/* add a blackish backdrop that displays with the modal box */}
      <div className="modal show d-block" id="metaBrowserModal"> {/* add a display-block property to the modal so it is shown when rendered */}
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title p-2">Metadata Browser</h3>
              <button type="button" className="btn-close" onClick={() => onClose()}></button>
            </div>
            <div className="modal-body">
              <div className="p-2">
                <h5>Editing file: {fileInfo?.full_path ?? fileInfo?.name}</h5>
                
                <MetadataBrowserTable 
                  initialQuery={query}
                  initialSelected={selected}
                  onRowSelect={onRowSelect}
                />

              </div>
            </div>

            <div className="modal-footer justify-content-between">
              <div className="">Powered by MusicBrainz's API</div>

              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={
                    () => { 
                      // still testing this. i'll change this up latr
                      if(!selected) {
                        setIsError(true);
                        setErrMsg("Please select a metadata before confirming your selection.");
                        return;
                      }
                      onConfirm(selected);
                      onClose();
                    }
                  }>Confirm</button>
                <button 
                  type="button" 
                  className="btn btn-light" 
                  onClick={() => { onClose() }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MetaBrowserErrorDialog 
        show={isError}
        message={errMsg}
        onClose={() => setIsError(false)}
      />
    </> 
  );
}

export default MetadataBrowserMain;
