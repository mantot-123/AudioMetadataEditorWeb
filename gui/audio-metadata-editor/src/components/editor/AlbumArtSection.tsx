import { useEffect, useState } from "react";

import { useCurrentFile } from "../../context/CurrentFileContext";
import { getFileAlbumArt } from "../../services/services";

function AlbumArtSection() {
  const { fileInfo } = useCurrentFile();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const loadAlbumArt = async () => {
      if (!fileInfo?.full_path) {
        setImage(null);
        return;
      }

      try {
        const response = await getFileAlbumArt(fileInfo.full_path);
        const imgData = response.data?.result?.img;
        const mimeType = response.data?.result?.mime ?? "image/png";

        if (typeof imgData === "string" && imgData.length > 0) {
          setImage(`data:${mimeType};base64,${imgData}`);
        } else {
          setImage(null);
        }
      } catch (error) {
        console.error("Error loading album art:", error);
        setImage(null);
      }
    };

    void loadAlbumArt();
  }, [fileInfo?.full_path]);

  return (
    <div className="container mb-4">
      <div className="border rounded-3 p-3 bg-light">
        <h6 className="fw-semibold mb-3">Album Art</h6>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 220 }}>
          {image ? (
            <img
              src={image}
              alt="Album art preview"
              className="img-fluid rounded-3"
              style={{ maxHeight: 220, objectFit: "contain" }}
            />
          ) : (
            <span className="text-muted">No album art available</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlbumArtSection;