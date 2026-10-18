import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ResearchItem, researchSectionForItem, safeResearchLink } from "../../data/researchData";
import { usePublishedResearch } from "../../services/researchPublishing";
import "../../styles/research.css";

interface ResearchViewProps { path?: string; }
function DocumentRow({ item }: { item: ResearchItem }) {
  const href = safeResearchLink(item.link);
  return <div className="research-document">
    <span className="research-arrow" aria-hidden="true" />
    <div className="research-document-content">
      <div className="research-document-title">
        {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>{item.title}</a> : <span>{item.title}</span>}
        {item.badge && <span className="research-badge">{item.badge}</span>}
      </div>
      {item.description && <p>{item.description}</p>}
    </div>
  </div>;
}
export const ResearchView: React.FC<ResearchViewProps> = ({ path }) => {
  const { data, loading, error } = usePublishedResearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const sections = data.sections.filter(section => !section.hidden);
  const legacySection = path?.endsWith("/projects") ? "sponsored" : path?.endsWith("/publications") ? "academic" : path?.endsWith("/patents") ? "innovation" : "updates";
  const current = sections.find(section => section.id === (searchParams.get("section") || legacySection)) || sections[0];
  const items = data.items.filter(item => !item.hidden && researchSectionForItem(item) === current?.id);
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
    <div className="research-layout">
      <aside className="research-sidebar">
        <div className="research-nav-heading">Explore Research</div>
        <nav aria-label="Research sections">
          {sections.map(section => <button key={section.id} type="button" aria-current={current?.id === section.id ? "page" : undefined}
            onClick={() => setSearchParams({ section: section.id }, { preventScrollReset: true })}>
            <span>{section.title}</span><span className="research-nav-chevron" aria-hidden="true">›</span>
          </button>)}
        </nav>
      </aside>
      <section className="research-content" aria-labelledby="research-section-title" aria-busy={loading}>
        <div className="research-section-heading"><div><p className="research-eyebrow">RESEARCH & DISCOVERY</p><h2 id="research-section-title">{current?.title || "Research"}</h2></div><span className="research-heading-rule" /></div>
        {loading ? <p role="status">Loading research content…</p> : error ? <p role="alert" className="research-status">{error}</p> : <>
          {current?.description && <p className="research-section-description">{current.description}</p>}
          <div key={current?.id} className="research-documents">
            {items.filter(item => !item.parentId).map(item => item.type === "accordion" ? <div key={item.id} className="research-accordion-row">
              <span className="research-arrow" aria-hidden="true" /><details className="research-accordion" open>
                <summary>{item.title}{item.badge && <span className="research-badge">{item.badge}</span>}<span className="research-accordion-chevron" aria-hidden="true" /></summary>
                <div className="research-accordion-body">
                  {item.description && <p>{item.description}</p>}
                  {items.filter(child => child.parentId === item.id).map(child => <DocumentRow key={child.id} item={child} />)}
                </div>
              </details>
            </div> : <DocumentRow key={item.id} item={item} />)}
          </div>
          {items.filter(item => !item.parentId).length === 0 && <div className="research-empty"><span className="research-empty-rule" /><h3>{current?.title || "Research information"}</h3><p>Information and documents for this section will be published here.</p></div>}
          {items.some(item => !item.link && item.type !== "accordion") && <p className="research-document-note">Documents become available as they are published by the university.</p>}
        </>}
      </section>
    </div>
  </main>;
};
