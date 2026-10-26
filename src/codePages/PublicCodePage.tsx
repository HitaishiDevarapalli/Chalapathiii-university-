import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { codeApi, PublicCodePage as CodePage } from "./model";
import { CODE_PAGE_SANDBOX } from "../../server/src/codePages/navigation";

export function usePublishedCodePage(route: string, enabled: boolean) {
  const [result, setResult] = useState<{
    route: string;
    page: CodePage | null;
    error: string;
  }>({ route: "", page: null, error: "" });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    codeApi<CodePage | null>(`/resolve?route=${encodeURIComponent(route)}`)
      .then((page) => {
        if (active) setResult({ route, page, error: "" });
      })
      .catch(() => {
        if (active)
          setResult({
            route,
            page: null,
            error: "The page registry is temporarily unavailable.",
          });
      });
    return () => {
      active = false;
    };
  }, [route, enabled, retry]);
  return {
    page: enabled && result.route === route ? result.page : null,
    loading: enabled && result.route !== route,
    error: enabled && result.route === route ? result.error : "",
    retry: () => {
      setResult({ route: "", page: null, error: "" });
      setRetry((v) => v + 1);
    },
  };
}
export default function PublicCodePage({ page }: { page: CodePage }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(800);
  const canonical =
    page.seo.canonical || `https://chalapathiuniversity.edu.in${page.route}`;
  useEffect(() => {
    // Helmet manages its own tags; index.html's static fallbacks otherwise remain first.
    // Restore those exact nodes when leaving a code page so the existing routes keep their defaults.
    const selector = [
      'meta[name="description"]',
      'meta[name="robots"]',
      'link[rel="canonical"]',
      ...["title", "description", "image", "url"].map(
        (name) => `meta[property="og:${name}"]`,
      ),
      ...["title", "description", "image", "card"].map(
        (name) => `meta[name="twitter:${name}"]`,
      ),
    ].join(",");
    const fallbacks = [...document.head.querySelectorAll(selector)].filter(
      (node) =>
        !node.hasAttribute("data-rh") &&
        !node.hasAttribute("data-code-page-seo"),
    );
    fallbacks.forEach((node) => node.remove());
    return () => {
      fallbacks.forEach((node) => document.head.appendChild(node));
    };
  }, []);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== "null" ||
        event.data?.type !== "code-page" ||
        event.data.channel !== page.versionId
      )
        return;
      if (event.data.kind === "height" && Number.isFinite(event.data.message))
        setHeight(Math.max(320, Math.min(30000, event.data.message)));
      if (
        event.data.kind === "anchor" &&
        typeof event.data.message?.top === "number" &&
        Number.isFinite(event.data.message.top)
      ) {
        const element = frame.current;
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        const offset = Math.max(0, Math.min(bounds.height, event.data.message.top));
        // Keep section headings visible beneath the site's fixed/sticky header.
        const header = document.querySelector("header");
        const headerStyle = header && getComputedStyle(header);
        const headerHeight = header && ["fixed", "sticky"].includes(headerStyle!.position)
          ? header.getBoundingClientRect().height : 0;
        window.scrollTo({
          top: Math.max(0, window.scrollY + bounds.top + offset - headerHeight),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [page.versionId]);
  return (
    <>
      <Helmet>
        <title>{page.seo.title || page.name}</title>
        <meta
          data-code-page-seo=""
          name="description"
          content={page.seo.description}
        />
        <meta
          data-code-page-seo=""
          name="robots"
          content={page.seo.noindex ? "noindex, nofollow" : "index, follow"}
        />
        <link data-code-page-seo="" rel="canonical" href={canonical} />
        <meta
          data-code-page-seo=""
          property="og:title"
          content={page.seo.ogTitle || page.seo.title || page.name}
        />
        <meta
          data-code-page-seo=""
          property="og:description"
          content={page.seo.ogDescription || page.seo.description}
        />
        {page.seo.image && (
          <meta
            data-code-page-seo=""
            property="og:image"
            content={page.seo.image}
          />
        )}
        <meta data-code-page-seo="" property="og:url" content={canonical} />
        <meta
          data-code-page-seo=""
          name="twitter:card"
          content={page.seo.image ? "summary_large_image" : "summary"}
        />
        <meta
          data-code-page-seo=""
          name="twitter:title"
          content={page.seo.ogTitle || page.seo.title || page.name}
        />
        <meta
          data-code-page-seo=""
          name="twitter:description"
          content={page.seo.ogDescription || page.seo.description}
        />
        {page.seo.image && (
          <meta
            data-code-page-seo=""
            name="twitter:image"
            content={page.seo.image}
          />
        )}
      </Helmet>
      <iframe
        ref={frame}
        key={page.versionId}
        title={page.name}
        src={page.contentUrl}
        sandbox={CODE_PAGE_SANDBOX}
        referrerPolicy="no-referrer"
        style={{
          display: "block",
          width: "100%",
          height,
          border: 0,
          minHeight: "80vh",
          background: "white",
        }}
      />
    </>
  );
}
