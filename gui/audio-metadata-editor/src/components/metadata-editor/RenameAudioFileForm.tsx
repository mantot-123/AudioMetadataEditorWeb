import { useState, useEffect } from "react";
import { useCurrentFile } from "../../context/CurrentFileContext";

function RenameAudioFileForm() {
  const { fileInfo,  updateCurrentFileValue } = useCurrentFile();
  const fileNameWithoutExt = (name: string, ext: string): string => {
    if (!name) return "";
    if (ext && name.toLowerCase().endsWith(ext.toLowerCase())) {
      return name.slice(0, -ext.length);
    }
    return name;
  };

  // rename handler
  const onRenameFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsFormProcessing(true);
      setStatusMsg({type: FormStatusMsgType.Info, msg: "Changing file name..."});

      if(!newFileName) {
        setStatusMsg({ type: FormStatusMsgType.Error, msg: "New file name cannot be empty." });
        return;
      }
      
      const renameResponse = await axios.post("/rename-file", {
        filename: fileInfo?.full_path,
        new_name: newFileName + fileInfo?.file_ext
      });

      const renameResultMsg: string = renameResponse.data.result as string;
      const newRelPath: string = renameResponse.data.full_path as string;

      const newFileDetails = await axios.get<AudioFile>("/get-file", {
        params: { filename: newRelPath },
      });

      updateCurrentFile(newFileDetails.data);
      setStatusMsg({ type: FormStatusMsgType.Success, msg: renameResultMsg });

    } catch(error) {
      setStatusMsg({ type: FormStatusMsgType.Error, msg: (error as any).response.data["result"] as string })
    } finally {
      setIsFormProcessing(false);
    }
  };
  
  const [newFileName, setNewFileName] = useState<string>(() =>
    fileNameWithoutExt(fileInfo?.name ?? "", fileInfo?.file_ext ?? "")
  );
  return (
    <>        
      <form id="rename-form" onSubmit={onRenameFile} method="POST">
        <div className="my-4">
          <label htmlFor="newfilename" className="form-label">File name:</label>
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Enter file name"
              name="newfilename"
              id="newfilename"
              onChange={(e) => setNewFileName(e.target.value)}
              value={newFileName}
            />
            <span className="input-group-text" id="basic-addon2">{fileInfo?.file_ext}</span>
            <button type="submit" className="btn btn-primary">Rename</button>
          </div>
        </div>
      </form>
    
    </>
  );
}

export default RenameAudioFileForm;