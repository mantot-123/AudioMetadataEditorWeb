import { useState, useEffect } from "react";

import { useCurrentFile } from "../../context/CurrentFileContext";
import { useTagForm } from "../../context/TagFormContext";

import MetadataBrowserTable from "./MetadataBrowserTable";
import MetaBrowserErrorDialog from "./MetaBrowserErrorDialog";

interface MetadataBrowserProps {
  show: boolean,
  onClose(): void,
}

// display the browser as a modal
function MetadataBrowserMain({ show, onClose }: MetadataBrowserProps) {
  const {
    userTags,
    setTagFormValue
  } = useTagForm();
  
  const [isError, setIsError] = useState<boolean>(false);
  const [query, setQuery] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    setQuery(userTags);
  }, [userTags.album_artist, 
    userTags.album, 
    userTags.title, 
    userTags.year, 
    userTags.genre, 
    userTags.track_number, 
    userTags.disc_number]);

  // get row from the metadata table that was selected
  const onRowSelect = (d: any) => {
    setSelected(d);
  }

  const onConfirm = (d: any) => {
    setTagFormValue("title", d.title);
    setTagFormValue("album_artist", d.album_artist);
    setTagFormValue("album", d.album);
    setTagFormValue("year", d.year);
    setTagFormValue("genre", d.genre);
    setTagFormValue("track_number", d.track_number);
    setTagFormValue("disc_number", d.disc_number);
  };

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
                  className={`btn btn-primary ${selected ? "" : "disabled"}`} 
                  onClick={
                    () => { 
                      if(!selected) {
                        setIsError(true);
                        setErrMsg("Please select a tag before confirming your selection.");
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
