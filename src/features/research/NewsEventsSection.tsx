import React from "react";
import { Link } from "react-router-dom";
import { accreditationBadges } from "@/data";
import { useData } from "@/context/DataContext";

export default function NewsEventsSection() {
  const { news, events } = useData();

  const displayNews = (news && news.length > 0)
    ? news.slice(0, 3).map((n) => {
        const parts = (n.date || "").trim().split(" ");
        return {
          day: parts[0] || "1",
          month: (parts[1] || "").toUpperCase().substring(0, 3),
          title: n.title,
          slug: n.slug
        };
      })
    : [];

  const displayEvents = (events && events.length > 0)
    ? events.slice(0, 3).map((e) => {
        const parts = (e.date || "").trim().split(" ");
        return {
          day: parts[0] || "1",
          month: (parts[1] || "").toUpperCase().substring(0, 3),
          title: e.title,
          time: e.time,
          slug: e.slug
        };
      })
    : [];

  return (
    <section className="bg-[#F7F7F7] border-y border-[#E5E7EB]">
      <div className="max-w-[1340px] mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* News */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex justify-between items-baseline">
            <h3 className="text-[16px] font-[var(--font-poppins)] font-extrabold text-[#081A36]">
              News & Events
            </h3>
            <Link to="/news" className="text-[11px] font-bold text-[#D4AF37] hover:underline">
              View All News →
            </Link>
          </div>
          <div className="space-y-4">
            {displayNews.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] text-center text-xs text-gray-400">
                No news articles published yet.
              </div>
            ) : (
              displayNews.map((n, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-white rounded-lg p-3 border border-[#E5E7EB] shadow-sm hover:shadow transition-shadow"
                >
                  <div className="w-12 shrink-0 rounded bg-[#D4AF37] text-white text-center py-1.5 shadow-sm">
                    <span className="block text-[14px] font-extrabold leading-none">{n.day}</span>
                    <span className="block text-[8px] font-bold tracking-wider mt-0.5">{n.month}</span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#222] leading-snug">{n.title}</h4>
                    <Link
                      to={n.slug ? `/news/${n.slug}` : "/news"}
                      className="text-[10px] font-bold text-[#D4AF37] hover:underline mt-1 inline-block"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rankings */}
        <div className="lg:col-span-4 space-y-5">
          <h3 className="text-[16px] font-[var(--font-poppins)] font-extrabold text-[#081A36]">
            Rankings & Accreditations
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {accreditationBadges.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-[#E5E7EB] p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-[#F7F7F7] border border-[#E5E7EB] flex items-center justify-center mb-2">
                  <span className="text-[8px] font-extrabold text-[#081A36]">CU</span>
                </div>
                <span className="text-[12px] font-extrabold text-[#081A36] leading-none">
                  {b.tag}
                </span>
                <span className="text-[8px] text-[#888] font-semibold uppercase mt-0.5">
                  {b.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex justify-between items-baseline">
            <h3 className="text-[16px] font-[var(--font-poppins)] font-extrabold text-[#081A36]">
              Upcoming Events
            </h3>
            <Link to="/news/events" className="text-[11px] font-bold text-[#D4AF37] hover:underline">
              View All Events →
            </Link>
          </div>
          <div className="space-y-4">
            {displayEvents.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] text-center text-xs text-gray-400">
                No upcoming events scheduled.
              </div>
            ) : (
              displayEvents.map((e, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start bg-white rounded-lg p-3 border border-[#E5E7EB] shadow-sm hover:shadow transition-shadow"
                >
                  <div className="w-11 shrink-0 rounded bg-[#081A36] text-white text-center py-1.5">
                    <span className="block text-[13px] font-extrabold leading-none">{e.day}</span>
                    <span className="block text-[7px] font-bold tracking-wider mt-0.5">{e.month}</span>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#222] leading-snug">{e.title}</h4>
                    <span className="text-[10px] text-[#888] font-medium mt-0.5 inline-block">
                      {e.time} Onwards
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
