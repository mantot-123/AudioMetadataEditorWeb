import axios from "axios";
import { useState, useEffect } from "react";
import { useCurrentFile } from "../../context/CurrentFileContext";

function MetadataAlbumArt() {
  const { fileInfo } = useCurrentFile();
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    axios.get('/get-album-art', {
      params: {
        filename: fileInfo?.full_path,
      }
    })
      .then((response) => {
        const imgData = response.data.result.img; // e.g. { image: "iVBORw0KGgoAAAANS..." }
        const mimeType = response.data.result.mime ?? 'image/png'; // check what your API actually returns
        setImage(`data:${mimeType};base64,${imgData}`);
      });
  }, []);

  const applyArt = async () => {

  };

  return ( 
    <>
      <h4>Album Art</h4>
      <div className="col-md-12">
        <div className="ratio ratio-1x1 my-4">
          {image && <img src={image} alt="Album art preview" />}
        </div>
      </div>
    </>
  );
}

export default MetadataAlbumArt;
