import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { academicDocumentPath } from "../../services/academicDocuments";

const degrees = ["BTech", "MTech"] as const;
type Degree = (typeof degrees)[number];

export default function SyllabusRegulationsMenu({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeDegree, setActiveDegree] = useState<Degree | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const menuId = `syllabus-regulations-${mobile ? "mobile" : "desktop"}`;

  const close = () => {
    setOpen(false);
    setActiveDegree(null);
  };

  useEffect(() => {
    close();
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={mobile ? "border-b border-gray-100 py-3" : "relative h-full flex items-center"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen(!open);
          setActiveDegree(null);
        }}
        className={mobile
          ? "w-full flex items-center justify-between text-[15px] font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors font-[var(--font-poppins)] text-left cursor-pointer"
          : "px-1.5 min-[1280px]:px-2 min-[1440px]:px-2 py-2 text-[12.5px] min-[1280px]:text-[13.5px] min-[1440px]:text-[14.5px] font-[600] text-[#072A6C] hover:text-[#D4AF37] transition-colors whitespace-nowrap font-[var(--font-poppins)] inline-flex items-center gap-1 cursor-pointer"}
      >
        Syllabus &amp; Regulations
        <ChevronDown size={mobile ? 16 : 13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id={menuId}
          className={mobile
            ? "mt-2 border-t border-gray-50 pt-2 pl-4"
            : "absolute left-0 top-full w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-xl z-50 font-[var(--font-poppins)]"}
        >
          {degrees.map((degree) => (
            <div key={degree} className="relative">
              <button
                type="button"
                aria-expanded={activeDegree === degree}
                aria-controls={`${menuId}-${degree}`}
                onClick={() => setActiveDegree(activeDegree === degree ? null : degree)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-left hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] cursor-pointer transition-colors ${activeDegree === degree ? "bg-[#D4AF37]/5 text-[#D4AF37]" : "text-[#222222]"}`}
              >
                {degree}
                {mobile ? <ChevronDown size={14} className={activeDegree === degree ? "rotate-180" : ""} /> : <ChevronRight size={14} />}
              </button>
              {activeDegree === degree && (
                <div
                  id={`${menuId}-${degree}`}
                  aria-label={`${degree} documents`}
                  className={mobile
                    ? "ml-4 flex flex-col border-l border-gray-100"
                    : "absolute left-full top-0 flex w-48 flex-col rounded-xl border border-gray-200 bg-white py-2 shadow-xl z-50"}
                >
                  {[
                    { label: "Syllabus", to: academicDocumentPath(degree === "BTech" ? "btech" : "mtech", "syllabus") },
                    { label: "Regulations", to: academicDocumentPath(degree === "BTech" ? "btech" : "mtech", "regulations") },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="px-4 py-2.5 text-[13px] font-medium text-[#222222] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors"
                      onClick={() => {
                        close();
                        onNavigate?.();
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
