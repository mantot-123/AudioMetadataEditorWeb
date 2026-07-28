import { useMemo, useState } from "react";

import BaseInfoSection from "../components/editor/BaseInfoSection";
import EditorSection from "../components/editor/EditorSection";
import StreamInfoSection from "../components/editor/StreamInfoSection";
import TrackInfoSection from "../components/editor/TrackInfoSection";
import { useCurrentFile } from "../context/CurrentFileContext";

type EditorPageTab = "editor" | "details";

function EditorPage() {
  const { fileInfo } = useCurrentFile();
  const [activeTab, setActiveTab] = useState<EditorPageTab>("editor");

  const hasSelectedFile = useMemo(() => {
    const filepath = fileInfo?.full_path;
    return typeof filepath === "string" && filepath.trim().length > 0;
  }, [fileInfo?.full_path]);

  return (
    <div className="container py-3">
      <div
        className="mx-auto rounded-4 border shadow-sm bg-white p-3"
        style={{ width: "100%" }}
      >
        {!hasSelectedFile ? (
          <div className="text-center py-5 px-3">
            <h5 className="fw-semibold mb-2">No audio file selected</h5>
            <p className="text-muted mb-0">
              Select a file from the list to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="d-flex rounded-pill border overflow-hidden bg-light p-1 mb-3">
              <button
                type="button"
                className={`btn btn-sm flex-grow-1 rounded-pill ${activeTab === "editor" ? "btn-dark" : "btn-light"}`}
                onClick={() => setActiveTab("editor")}
              >
                Edit
              </button>
              <button
                type="button"
                className={`btn btn-sm flex-grow-1 rounded-pill ${activeTab === "details" ? "btn-dark" : "btn-light"}`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
            </div>

            {activeTab === "editor" ? (
              <EditorSection />
            ) : (
              <div className="d-flex flex-column gap-3">
                <section className="border rounded p-3 bg-light">
                  <h5 className="fw-semibold mb-3">File Information</h5>
                  <BaseInfoSection />
                </section>

                <section className="border rounded p-3 bg-light">
                  <h5 className="fw-semibold mb-3">Stream Information</h5>
                  <StreamInfoSection />
                </section>

                <section className="border rounded p-3 bg-light">
                  <h5 className="fw-semibold mb-3">Track Information</h5>
                  <TrackInfoSection />
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EditorPage;