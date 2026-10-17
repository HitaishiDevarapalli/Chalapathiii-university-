import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";
import { BuilderDocument, BuilderNode, builderApi, containers } from "./model";
import "./builder.css";

export function nodeStyle(node: BuilderNode): React.CSSProperties {
  const result: Record<string, string | number> = {};
  for (const [tier, style] of [
    ["", node.style],
    ["t-", node.responsive?.tablet],
    ["m-", node.responsive?.mobile],
  ] as const)
    for (const [key, value] of Object.entries(style || {}))
      result[`--pb-${tier}${key}`] =
        typeof value === "number" &&
        !["columns", "lineHeight", "fontWeight"].includes(key)
          ? `${value}px`
          : value;
  return result as React.CSSProperties;
}
const safe = (url?: string) =>
  url &&
  (/^\/(?!\/)[^\s\\]*$/.test(url) ||
    /^https:\/\/[^\s\\]+$/.test(url) ||
    /^mailto:[^\s<>]+@[^\s<>]+$/.test(url) ||
    /^tel:\+?[\d ()-]+$/.test(url))
    ? url
    : undefined;
// Small, escaped rich-text vocabulary; no HTML parsing or executable markup.
function richText(text = "") {
  return text
    .split(/(\*\*[^*]+\*\*|_[^_]+_)/g)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : part.startsWith("_") && part.endsWith("_") ? (
        <em key={index}>{part.slice(1, -1)}</em>
      ) : (
        part
      ),
    );
}
export function NodeContent({
  node,
  children,
  editing = false,
}: {
  node: BuilderNode;
  children?: React.ReactNode;
  editing?: boolean;
}) {
  const p = node.props || {};
  const href = safe(p.href);
  const linkProps = {
    href,
    target: p.newTab ? "_blank" : undefined,
    rel: p.newTab ? "noopener noreferrer" : undefined,
    onClick: editing ? (e: React.MouseEvent) => e.preventDefault() : undefined,
  };
  if (containers.has(node.type))
    return (
      <div
        className={`pb-children ${["columns", "grid", "card-grid"].includes(node.type) ? "pb-grid" : ""}`}
        data-proportions={node.style.proportions}
      >
        {children}
      </div>
    );
  switch (node.type) {
    case "heading": {
      const Tag = /^h[1-6]$/.test(p.level || "") ? p.level! : "h2";
      return <Tag>{p.text}</Tag>;
    }
    case "paragraph":
      return <p className="pb-copy">{richText(p.text)}</p>;
    case "text":
      return <div className="pb-copy">{p.text}</div>;
    case "notice":
      return <aside className="pb-notice">{p.text}</aside>;
    case "icon-text":
      return (
        <div className="pb-icon-text">
          <span aria-hidden="true">
            {
              { info: "ⓘ", book: "▤", award: "☆", calendar: "▦" }[
                p.icon || "info"
              ]
            }
          </span>
          <p>{p.text}</p>
        </div>
      );
    case "image": {
      const img = safe(p.url) ? (
        <img
          src={safe(p.url)}
          alt={p.alt || ""}
          loading="lazy"
          decoding="async"
          style={{
            objectFit: p.objectFit || "cover",
            aspectRatio: p.aspectRatio === "auto" ? undefined : p.aspectRatio,
          }}
        />
      ) : editing ? (
        <div className="pb-image-empty">Choose an image in Properties</div>
      ) : null;
      return (
        <figure>
          {href ? <a {...linkProps}>{img}</a> : img}
          {p.caption && <figcaption>{p.caption}</figcaption>}
        </figure>
      );
    }
    case "gallery":
      return (
        <div className="pb-gallery">
          {p.images?.map((i, index) => (
            <img
              key={index}
              src={safe(i.url)}
              alt={i.alt}
              loading="lazy"
              decoding="async"
            />
          ))}
          {editing && !p.images?.length && (
            <div className="pb-image-empty">Add images in Properties</div>
          )}
        </div>
      );
    case "video":
      return /^https:\/\/(www\.youtube-nocookie\.com\/embed\/[\w-]+|player\.vimeo\.com\/video\/\d+)$/.test(
        p.url || "",
      ) ? (
        <iframe
          src={p.url}
          title={p.caption || "Video"}
          loading="lazy"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : editing ? (
        <div className="pb-image-empty">Add a supported video embed URL</div>
      ) : null;
    case "link":
      return (
        <a {...linkProps} className="pb-link">
          {p.text || "Link"}
        </a>
      );
    case "button":
      return (
        <a
          {...linkProps}
          className={`pb-button pb-button-${p.variant || "primary"}`}
        >
          {p.text || "Learn more"}
        </a>
      );
    case "download":
      return (
        <a {...linkProps} download className="pb-link">
          {p.text || "Download document"}
        </a>
      );
    case "divider":
      return <hr />;
    case "spacer":
      return <div aria-hidden="true" />;
    case "table": {
      const rows = p.rows || [];
      return (
        <div className="pb-table-scroll">
          <table>
            <caption>{p.caption || ""}</caption>
            {p.header && rows.length > 0 && (
              <thead>
                <tr>
                  {rows[0].map((cell, i) => (
                    <th scope="col" key={i}>
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.slice(p.header ? 1 : 0).map((r, index) => (
                <tr key={index}>
                  {r.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "accordion":
      return (
        <div className="pb-faq">
          {p.items?.map((item, i) => (
            <details key={i} open={editing || undefined}>
              <summary>{item.question}</summary>
              <p className="pb-copy">{item.answer}</p>
            </details>
          ))}
        </div>
      );
    default:
      return editing ? <p>Unsupported component</p> : null;
  }
}
export function BuilderRenderer({
  document,
  device,
}: {
  document: BuilderDocument;
  device?: string;
}) {
  const render = (node: BuilderNode, depth = 0): React.ReactNode =>
    !node || depth > 8 ? null : (
      <div
        className={`pb-node pb-type-${node.type}`}
        key={node.id}
        style={nodeStyle(node)}
      >
        <NodeContent node={node}>
          {(node.children || []).map((n) => render(n, depth + 1))}
        </NodeContent>
      </div>
    );
  return (
    <div className="pb-renderer" data-device={device}>
      {(document.nodes || []).map((n) => render(n))}
    </div>
  );
}
export function PublicBuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [document, setDocument] = useState<BuilderDocument | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setDocument(null);
    setError("");
    builderApi(`/public?slug=${encodeURIComponent(location.pathname)}`)
      .then((data) => {
        if (!active) return;
        if (data.redirect) navigate(data.redirect, { replace: true });
        else setDocument(data.document);
      })
      .catch((e) => {
        if (active)
          setError(
            e.status === 404
              ? "This page is unavailable or has not been published."
              : "The page could not be loaded. Please try again.",
          );
      });
    return () => {
      active = false;
    };
  }, [location.pathname, navigate, retry]);
  return (
    <article className="pb-public">
      {document ? (
        <>
          <SEO
            title={document.metaTitle || document.title}
            description={document.metaDescription}
            image={document.socialImage || undefined}
            url={
              document.canonical ||
              `https://chalapathiuniversity.edu.in${document.slug}`
            }
          />
          <div className="pb-public-heading">
            <Link to="/">Home</Link>
            <span> / {document.title}</span>
            <h1>{document.title}</h1>
          </div>
          <BuilderRenderer document={document} />
        </>
      ) : error ? (
        <div className="pb-public-heading">
          <Helmet>
            <meta name="robots" content="noindex" />
          </Helmet>
          <h1>Page unavailable</h1>
          <p role="alert">{error}</p>
          <button onClick={() => setRetry((v) => v + 1)}>Try again</button>
          <Link to="/">Return home</Link>
        </div>
      ) : (
        <p role="status">Loading page…</p>
      )}
    </article>
  );
}
export function useBuilderPlacements() {
  const [data, setData] = useState<{
    navigation: any[];
    homepage: { id: string; document: BuilderDocument }[];
  }>({ navigation: [], homepage: [] });
  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (document.visibilityState !== "hidden")
        builderApi("/placements")
          .then((value) => {
            if (active) setData(value);
          })
          .catch(() => {
            if (active) setData({ navigation: [], homepage: [] });
          });
    };
    refresh();
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    window.addEventListener("builder-published", refresh);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("builder-published", refresh);
    };
  }, []);
  return data;
}
export function BuilderHomepageSlot() {
  const { homepage } = useBuilderPlacements();
  return homepage.length ? (
    <section className="pb-home-slot" aria-label="University highlights">
      {homepage.map(({ id, document }) => (
        <div key={id} className={`pb-home-${document.placement.homeMode}`}>
          <h2>
            <Link to={document.slug}>
              {document.placement.label || document.title}
            </Link>
          </h2>
          {document.placement.homeMode === "card" && (
            <p>{document.metaDescription}</p>
          )}
          {document.placement.homeMode === "section" && (
            <BuilderRenderer document={document} />
          )}
          {document.placement.homeMode !== "link" && (
            <Link className="pb-link" to={document.slug}>
              Explore page →
            </Link>
          )}
        </div>
      ))}
    </section>
  ) : null;
}
