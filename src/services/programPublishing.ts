import { useEffect, useState } from "react";
import { CmsApiService } from "./cmsApi";

export function usePublishedPrograms() {
  const [configs, setConfigs] = useState<Record<string, any>>({});
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/config", { cache: "no-store", credentials: "same-origin" });
        if (!response.ok) throw new Error("Published programs could not be loaded");
        const data = await response.json();
        if (active) setConfigs({ ...data, __loaded: true });
      } catch (error) { console.error(error); }
    };
    const publicRefresh = () => { if (!location.pathname.startsWith("/admin")) void refresh(); };
    void refresh();
    window.addEventListener("focus", publicRefresh);
    window.addEventListener("programs-published", refresh);
    const timer = window.setInterval(publicRefresh, 15000);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", publicRefresh); window.removeEventListener("programs-published", refresh); };
  }, []);
  return configs;
}

export async function publishProgram(slug: string, data: any, sections: any[], programs: any[]) {
  const result = await CmsApiService.saveAll({ pages: [], settings: {
    [`custom_program_data_${slug}`]: data,
    [`program_sections_order_${slug}`]: sections,
    programs,
  } });
  if (!result.success) throw new Error("Publishing failed. Your changes have not been published. Please sign in and retry.");
  // Older API deployments reported success even when a database write failed.
  const response = await fetch("/api/config", { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) throw new Error("Unable to verify publishing. Please retry.");
  const saved = await response.json();
  if (JSON.stringify(saved[`custom_program_data_${slug}`]) !== JSON.stringify(data) ||
      JSON.stringify(saved[`program_sections_order_${slug}`]) !== JSON.stringify(sections) ||
      JSON.stringify(saved.programs) !== JSON.stringify(programs)) {
    throw new Error("The server did not retain your changes. Publishing was not confirmed. Please retry.");
  }
  window.dispatchEvent(new Event("programs-published"));
}
