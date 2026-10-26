import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { codeApi, PublicCodePage as CodePage } from "./model";

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
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [page.versionId]);
  return (
    <>
      <Helmet>
        <title>{page.seo.title || page.name}</title>
        <meta name="description" content={page.seo.description} />
        <meta
          name="robots"
          content={page.seo.noindex ? "noindex, nofollow" : "index, follow"}
        />
        <link
          rel="canonical"
          href={
            page.seo.canonical ||
            `https://chalapathiuniversity.edu.in${page.route}`
          }
        />
        <meta
          property="og:title"
          content={page.seo.ogTitle || page.seo.title || page.name}
        />
        <meta
          property="og:description"
          content={page.seo.ogDescription || page.seo.description}
        />
        {page.seo.image && (
          <meta property="og:image" content={page.seo.image} />
        )}
      </Helmet>
      <iframe
        ref={frame}
        key={page.versionId}
        title={page.name}
        src={page.contentUrl}
        sandbox="allow-scripts"
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
