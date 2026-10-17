import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { BuilderRecord, builderApi } from "./model";
import { BuilderRenderer } from "./Renderer";

export default function DraftPreview() {
  const { id } = useParams();
  const [page, setPage] = useState<BuilderRecord | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    builderApi<BuilderRecord>(`/${id}`)
      .then((value) => {
        if (active) setPage(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  return (
    <>
      <Helmet>
        <title>{page?.document.title || "Draft preview"}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <article className="pb-public">
        {page ? (
          <>
            <div className="pb-draft-banner">
              Private draft preview · version {page.version}
            </div>
            <div className="pb-public-heading">
              <h1>{page.document.title}</h1>
            </div>
            <BuilderRenderer document={page.document} />
          </>
        ) : (
          <p role={error ? "alert" : "status"}>
            {error || "Loading secure preview…"}
          </p>
        )}
      </article>
      <Footer />
    </>
  );
}
