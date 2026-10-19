import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { researchBlocksForSection } from "../../data/researchBlocks";
import { usePublishedResearch } from "../../services/researchPublishing";
import { ResearchBlocks } from "./ResearchBlocks";
import "../../styles/research.css";

interface ResearchViewProps { path?: string; }
export const ResearchView: React.FC<ResearchViewProps> = ({ path }) => {
  const { data, loading, error } = usePublishedResearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const sections = data.sections.filter(section => !section.hidden);
  const requestedSection = searchParams.get("section");
  const legacySection = path?.endsWith("/projects") ? "sponsored" : path?.endsWith("/publications") ? "academic" : path?.endsWith("/patents") ? "innovation" : sections.some(section => section.id === "updates") ? "updates" : "overview";
  const current = sections.find(section => section.id === (requestedSection || legacySection)) || sections[0];
  const blocks = current ? researchBlocksForSection(data, current.id) : [];
  if (data.hidden || data.isUnderConstruction) return <div className="research-notice research-page">
    <h1>{data.hidden ? "Research information is temporarily unavailable" : data.pageTitle}</h1>
    <p>{data.underConstructionMessage}</p><Link to="/">Back to Home</Link>
  </div>;
  return <main className="research-page">
    <header className="research-heading"><div className="research-heading-inner">
      <div className="research-breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>Research</span></div>
      <p className="research-eyebrow">CHALAPATHI UNIVERSITY</p>
      <h1>{data.pageTitle}</h1><p className="research-subtitle">{data.pageSubtitle}</p>
    </div></header>
    <div className={`research-layout${sections.length ? "" : " research-layout--empty"}`}>
      {sections.length > 0 && <aside className="research-sidebar">
        <div className="research-nav-heading">Explore Research</div>
        <label className="research-mobile-section">Research section<select value={current?.id || ""} onChange={event => setSearchParams({ section: event.target.value }, { preventScrollReset: true })}>
          {sections.map(section => <option key={section.id} value={section.id}>{section.title}</option>)}
        </select></label>
        <nav aria-label="Research sections">
          {sections.map(section => <button key={section.id} type="button" aria-current={current?.id === section.id ? "page" : undefined}
            onClick={() => setSearchParams({ section: section.id }, { preventScrollReset: true })}>
            <span>{section.title}</span><span className="research-nav-chevron" aria-hidden="true">›</span>
          </button>)}
        </nav>
      </aside>}
      <section className="research-content" aria-labelledby="research-section-title" aria-busy={loading}>
        <div className="research-section-heading"><div><p className="research-eyebrow">RESEARCH & DISCOVERY</p><h2 id="research-section-title">{current?.title || "Research"}</h2></div><span className="research-heading-rule" /></div>
        {loading ? <p role="status">Loading research content…</p> : error ? <p role="alert" className="research-status">{error}</p> : <>
          {current?.description && <p className="research-section-description">{current.description}</p>}
          <div key={current?.id} className="research-documents"><ResearchBlocks blocks={blocks} /></div>
          {!blocks.some(block => !block.hidden) && <div className="research-empty"><span className="research-empty-rule" /><h3>{current?.title || "Research information"}</h3><p>{current ? "Information and documents for this section will be published here." : "No research sections are currently published."}</p></div>}
        </>}
      </section>
    </div>
  </main>;
};
