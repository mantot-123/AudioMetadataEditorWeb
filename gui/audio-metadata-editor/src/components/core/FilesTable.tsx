import { useEffect, useMemo, useState } from "react";

import type { AudioFile } from "../../types/AudioFile";
import { getAllFiles } from "../../services/services";

import { formatFileSizeBytes, formatUnixTime } from "../../helpers/formatHelpers";

import { useCurrentFile } from "../../context/CurrentFileContext";

function FilesTable() {
  const { updateCurrentFileValue } = useCurrentFile();

  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AudioFile; direction: "asc" | "desc" } | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getAllFiles();
        const payload = response.data;
        const data = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload.result) ? payload.result : []);

        setFiles(data as AudioFile[]);
        
      } catch (error) {
        console.error("Error loading files:", error);
        setErrorMessage("Unable to load files.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, []);

  const sortedFiles = useMemo(() => {
    const sortableFiles = [...files];

    if (!sortConfig) {
      return sortableFiles;
    }

    sortableFiles.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      const aComparable = aValue ?? "";
      const bComparable = bValue ?? "";

      if (typeof aComparable === "number" && typeof bComparable === "number") {
        return sortConfig.direction === "asc"
          ? aComparable - bComparable
          : bComparable - aComparable;
      }

      const comparison = String(aComparable).localeCompare(String(bComparable));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sortableFiles;
  }, [files, sortConfig]);

  const handleSort = (key: keyof AudioFile) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key, direction: "asc" };
    });
  };

  const getSortIndicator = (key: keyof AudioFile) => {
    if (sortConfig?.key !== key) {
      return "";
    }

    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <>
      <div
        className="custom-table-container"
        style={{
          height: "100%",
        }}
      >
        <table
          className="table table-hover align-middle mb-0"
          style={{
            width: "max-content",
            minWidth: "100%",
          }}
        >
          <thead 
            className="table-light sticky-top"
          >
            <tr>
              <th
                className="fw-bold"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort("name")}
              >
                File name{getSortIndicator("name")}
              </th>
              <th
                className="fw-bold"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort("full_path")}
              >
                Path{getSortIndicator("full_path")}
              </th>
              <th
                className="fw-bold"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort("mime_type")}
              >
                MIME Type{getSortIndicator("mime_type")}
              </th>
              <th
                className="fw-bold"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort("size")}
              >
                File Size{getSortIndicator("size")}
              </th>
              <th
                className="fw-bold"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort("modify_time")}
              >
                Date Modified{getSortIndicator("modify_time")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-muted py-4">
                  Loading files...
                </td>
              </tr>
            )}

            {!isLoading && errorMessage && (
              <tr>
                <td colSpan={4} className="text-danger py-4">
                  {errorMessage}
                </td>
              </tr>
            )}

            {!isLoading && !errorMessage && sortedFiles.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted py-4">
                  No files found.
                </td>
              </tr>
            )}

            {!isLoading && !errorMessage && sortedFiles.map((file, index) => (
              <tr
              style={{cursor: "pointer"}}
              onClick={() => {
                updateCurrentFileValue("name", file.name);
                updateCurrentFileValue("full_path", file.full_path);
              }}
              key={`${file.full_path ?? "file"}-${index}`}>
                <td>{file.name ?? "-"}</td>
                <td>{file.full_path ?? "-"}</td>
                <td>{file.mime_type ?? "-"}</td>
                <td>{formatFileSizeBytes(file.size)}</td>
                <td>{formatUnixTime(file.modify_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FilesTable;