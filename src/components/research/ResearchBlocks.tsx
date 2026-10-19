import React from "react";
import { ResearchBlock, safeResearchUrl } from "../../data/researchBlocks";
import "../../styles/research-blocks.css";
import { ResearchTable } from "./ResearchTable";

export function ResearchBlocks({ blocks, editing = false, showHidden = false }: { blocks: ResearchBlock[]; editing?: boolean; showHidden?: boolean }) {
  return <div className="research-block-content">{blocks.filter(block => showHidden || !block.hidden).map(block => <div className={`research-block research-block-${block.type}`} key={block.id} data-block-id={block.id}><ResearchBlockContent block={block} editing={editing} showHidden={showHidden} /></div>)}</div>;
}
export function ResearchBlockContent({ block, editing = false, showHidden = false, resizeHandle }: { block: ResearchBlock; editing?: boolean; showHidden?: boolean; resizeHandle?: React.ReactNode }) {
  const href = block.targetKind === "none" ? undefined : safeResearchUrl(block.href);
  const linkProps = { href, target: block.newTab ? "_blank" : undefined, rel: block.newTab ? "noopener noreferrer" : undefined,
    onClick: editing ? (event: React.MouseEvent) => event.preventDefault() : undefined };
  switch (block.type) {
    case "heading": { const Tag = block.level || "h3"; return <Tag className="research-block-heading">{block.text}</Tag>; }
    case "text": return <p className="research-block-text">{block.text}</p>;
    case "table": return block.table ? <ResearchTable table={block.table} /> : null;
    case "bullets": return <ul className="research-bullet-list">{(block.bullets || []).filter(bullet => showHidden || !bullet.hidden).map(bullet => {
      const url = bullet.targetKind === "none" ? undefined : safeResearchUrl(bullet.href);
      return <li className={`research-document${bullet.hidden ? " research-preview-hidden" : ""}`} key={bullet.id}>
        <span className="research-arrow" aria-hidden="true" /><div className="research-document-content"><div className="research-document-title">
          {url ? <a href={url} target={bullet.newTab ? "_blank" : undefined} rel={bullet.newTab ? "noopener noreferrer" : undefined} onClick={editing ? event => event.preventDefault() : undefined}>{bullet.text}</a> : <span>{bullet.text}</span>}
          {bullet.badge && <span className="research-badge">{bullet.badge}</span>}
        </div>{bullet.description && <p>{bullet.description}</p>}</div>
      </li>;
    })}</ul>;
    case "button": return href ? <a {...linkProps} className={`research-action research-action-${block.variant || "primary"}`}>{block.text}</a>
      : editing ? <span className={`research-action research-action-${block.variant || "primary"}`}>{block.text || "Button"}</span> : null;
    case "image": {
      const src = safeResearchUrl(block.imageUrl);
      const fixed = block.imageHeightMode === "fixed";
      const image = src ? <img src={src} alt={block.alt || ""} loading="lazy" decoding="async" style={{ objectFit: block.imageFit || "cover", objectPosition: `${block.imageFocusX ?? 50}% ${block.imageFocusY ?? 50}%` }} /> : editing ? <div className="research-image-placeholder">Upload an image or choose one from Media Storage</div> : null;
      const frame = <div className="research-image-frame" data-fixed-height={fixed || undefined} style={fixed ? { "--research-image-height": `${block.imageHeight || 280}px` } as React.CSSProperties : undefined}>{href ? <a {...linkProps}>{image}</a> : image}{resizeHandle}</div>;
      return <figure className={`research-figure research-image-${block.width || "full"} research-align-${block.align || "left"}`} data-image-placement={block.imagePlacement || "block"}
        style={{ ...(block.width === "custom" ? { width: `${block.imageWidth || 70}${block.imageWidthUnit || "%"}` } : {}), marginTop: block.imageSpaceBefore ?? 16, marginBottom: block.imageSpaceAfter ?? 16, "--research-image-text-gap": `${block.imageTextGap ?? 24}px` } as React.CSSProperties}>
        {frame}{block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>;
    }
    case "accordion": return <details className="research-accordion research-component-accordion" open><summary>{block.text}<span className="research-accordion-chevron" aria-hidden="true" /></summary><div className="research-accordion-body"><ResearchBlocks blocks={block.children || []} editing={editing} showHidden={showHidden} />{editing && !block.children?.length && <p className="research-empty-group">Add components inside this group using the component library.</p>}</div></details>;
    case "divider": return <hr className="research-content-divider" />;
    case "spacer": return <div aria-hidden="true" style={{ height: Math.max(8, Math.min(160, block.space || 32)) }} />;
  }
}
