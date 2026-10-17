import React, { useEffect, useState } from "react";
import { AdminSidebar } from "../components/admin/AdminWorkspace";
import { canViewTab, useAdminAccess } from "../security/adminAccess";
import { builderApi, type BuilderDocument } from "./model";

type SectionPage = {
  id: string;
  title: string;
  status: string;
  placement: BuilderDocument["placement"];
};
const sections: Record<string, string> = {
  "Main Menu": "links",
  "About Us": "about",
  Academics: "academics",
  Admissions: "admissions",
  Research: "research",
  Faculty: "directories",
  "Campus Life": "campus-life",
  Placements: "placements",
  "News & Events": "news-events",
  "Contact Us": "contact",
};
export const sectionForPage = (page: SectionPage) =>
  page.placement.kind === "homepage"
    ? "homepage"
    : page.placement.kind === "navigation"
      ? sections[page.placement.parent] || "pages"
      : "pages";

type Props = React.ComponentProps<typeof AdminSidebar> & {
  selectedPageId: string;
  onOpenPage: (id: string) => void;
};
export function SectionAwareSidebar({
  selectedPageId,
  onOpenPage,
  ...props
}: Props) {
  const { user, can } = useAdminAccess();
  const [pages, setPages] = useState<SectionPage[]>([]);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const allowed = can("pages");
  useEffect(() => {
    let active = true,
      generation = 0;
    if (!allowed) {
      setPages([]);
      return;
    }
    const refresh = async () => {
      const request = ++generation;
      try {
        const all: SectionPage[] = [];
        let page = 1,
          total = 0;
        do {
          const result = await builderApi<{
            items: SectionPage[];
            total: number;
          }>(`/section-pages?page=${page++}`);
          if (!active || generation !== request) return;
          all.push(...result.items);
          total = result.total;
          if (!result.items.length) break;
        } while (all.length < total);
        setPages(
          all.sort(
            (a, b) =>
              a.placement.position - b.placement.position ||
              a.title.localeCompare(b.title),
          ),
        );
        setError(false);
      } catch {
        if (active && generation === request) setError(true);
      }
    };
    void refresh();
    const handler = () => {
      void refresh();
    };
    window.addEventListener("builder-document-saved", handler);
    window.addEventListener("focus", handler);
    const timer = window.setInterval(handler, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("builder-document-saved", handler);
      window.removeEventListener("focus", handler);
    };
  }, [allowed, user?.id, retry]);
  const selected = pages.find((page) => page.id === selectedPageId);
  const activeSection = selected ? sectionForPage(selected) : props.activeTab;
  const forSection = (id: string) =>
    pages.filter((page) => sectionForPage(page) === id);
  const items = props.items.flatMap((item) => {
    const children = forSection(item.id);
    const legacyAllowed = canViewTab(user, item.id);
    if (!legacyAllowed && !children.length) return [];
    const existing = legacyAllowed
      ? (item.subItems || []).map((sub) => ({
          ...sub,
          isActive: !selectedPageId && sub.isActive,
          onClick: () => {
            onOpenPage("");
            sub.onClick();
          },
        }))
      : [];
    const added = children.map((page) => ({
      id: `builder:${page.id}`,
      label:
        page.title + (page.status === "published" ? "" : ` · ${page.status}`),
      isActive: selectedPageId === page.id,
      onClick: () => onOpenPage(page.id),
    }));
    return [
      {
        ...item,
        subItems:
          existing.length || added.length ? [...existing, ...added] : undefined,
      },
    ];
  });
  return (
    <>
      <AdminSidebar
        {...props}
        items={items}
        activeTab={activeSection}
        expanded={(id) =>
          selected && activeSection === id ? true : props.expanded(id)
        }
        onNavigate={(id) => {
          if (!canViewTab(user, id) && forSection(id).length)
            onOpenPage(forSection(id)[0].id);
          else {
            onOpenPage("");
            props.onNavigate(id);
          }
        }}
      />
      {error && !props.collapsed && (
        <button
          type="button"
          className="pb-sidebar-retry"
          onClick={() => setRetry((v) => v + 1)}
        >
          Section pages unavailable. Retry
        </button>
      )}
    </>
  );
}
