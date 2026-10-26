import React, { useEffect, useState } from "react";
import PageBuilder from "./PageBuilder";
import "../codePages/codePages.css";
const CodePageBuilder = React.lazy(
  () => import("../codePages/CodePageBuilder"),
);
export default function PageBuilderWorkspace(props: {
  initialPageId?: string;
  onReturnToPages?: () => void;
}) {
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    if (props.initialPageId) setMode("visual");
  }, [props.initialPageId]);
  return (
    <div>
      <div
        className="cp-builder-switch"
        role="tablist"
        aria-label="Page builder type"
      >
        <button
          role="tab"
          aria-selected={mode === "visual"}
          onClick={() => setMode("visual")}
        >
          <span>01</span>
          <div>
            <strong>Visual Page Builder</strong>
            <small>Build with reusable components</small>
          </div>
        </button>
        <button
          role="tab"
          aria-selected={mode === "code"}
          onClick={() => {
            setMode("code");
            setVisited(true);
          }}
        >
          <span>&lt;/&gt;</span>
          <div>
            <strong>Code-Based Page Builder</strong>
            <small>Upload, preview and publish a static page</small>
          </div>
        </button>
      </div>
      <div hidden={mode !== "visual"}>
        <PageBuilder {...props} />
      </div>
      {visited && (
        <div hidden={mode !== "code"}>
          <React.Suspense
            fallback={<div role="status">Loading Code-Based Page Builder…</div>}
          >
            <CodePageBuilder />
          </React.Suspense>
        </div>
      )}
    </div>
  );
}
