import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { useData } from "../context/DataContext";

export default function Events() {
  const { events } = useData();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Animation & Drag state refs
  const xRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isHovered = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    document.title = "Upcoming Events | Chalapathi University";
    window.scrollTo(0, 0);
  }, []);

  // Registration date cutoff check
  const isRegistrationClosed = (eventDateStr: string) => {
    try {
      const parts = eventDateStr.split(" ");
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const monthStr = parts[1];
        const year = parseInt(parts[2], 10);
        const months: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        const month = months[monthStr.substring(0, 3)] ?? 0;
        const eventDate = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today > eventDate;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  // Prepare events list to make sure it's long enough to scroll infinitely
  let eventSet = [...events];
  if (events.length > 0) {
    while (eventSet.length < 6) {
      eventSet = [...eventSet, ...eventSet];
    }
  }
  // Double it for seamless infinite loop wrapper
  const displayEvents = [...eventSet, ...eventSet];

  useEffect(() => {
    if (events.length === 0 || !trackRef.current) return;

    const track = trackRef.current;
    
    const updateAnimation = () => {
      if (!isDragging.current && !isHovered.current) {
        const totalWidth = track.scrollWidth;
        const halfWidth = totalWidth / 2;
        
        // Speed: moves 1px per frame (approx. 25-30s for full set loop at 60fps)
        xRef.current -= 1.0; 

        // Reset if we have scrolled past one full set of cards
        if (Math.abs(xRef.current) >= halfWidth) {
          xRef.current = 0;
        }

        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }
      animationFrameId.current = requestAnimationFrame(updateAnimation);
    };

    animationFrameId.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [events]);

  // Touch / Mouse Drag handlers
  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX - xRef.current;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current || !trackRef.current) return;
    
    currentX.current = clientX - startX.current;
    
    const totalWidth = trackRef.current.scrollWidth;
    const halfWidth = totalWidth / 2;

    // Wrap around bounds during manual drag
    if (currentX.current > 0) {
      currentX.current = -halfWidth + (currentX.current % halfWidth);
    } else if (Math.abs(currentX.current) >= halfWidth) {
      currentX.current = currentX.current % halfWidth;
    }

    xRef.current = currentX.current;
    trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]/30 font-[var(--font-poppins)] pb-24 relative select-none">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#072A6C] to-indigo-950 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1440px] mx-auto relative z-10 text-center lg:text-left space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-sm">
            Campus Activities
          </span>
          <h1 className="text-3xl lg:text-5xl font-[900] tracking-tight">University Events</h1>
          <p className="text-xs text-white font-light max-w-xl leading-relaxed">
            Participate in hackathons, expert workshops, alumni gatherings, and regional technology exhibitions.
          </p>
        </div>
      </section>

      {/* Events Carousel Section */}
      <section className="max-w-[1440px] mx-auto px-5 mt-16 overflow-hidden">
        <div className="mb-8 pb-5 border-b border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-[800] text-[#072A6C]">
            Upcoming Events
          </h2>
          <p className="text-[12px] text-gray-400 mt-1 font-light">Explore academic activities, guest lectures, and student festivals.</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400">No upcoming events listed at the moment.</p>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="w-full overflow-hidden cursor-grab active:cursor-grabbing relative select-none"
            onMouseEnter={() => { isHovered.current = true; }}
            onMouseLeave={() => { isHovered.current = false; handleDragEnd(); }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {/* Carousel track */}
            <div 
              ref={trackRef}
              className="flex gap-8 w-full transition-transform duration-75 ease-out will-change-transform"
              style={{ transform: "translate3d(0px, 0, 0)" }}
            >
              {displayEvents.map((item, idx) => {
                const closed = isRegistrationClosed(item.date);
                return (
                  <div
                    key={idx}
                    onClick={() => navigate(`/news/events/${item.slug}`)}
                    className="w-full md:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)] shrink-0 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 flex flex-col group text-left cursor-pointer outline-none pointer-events-auto"
                  >
                    {/* Image */}
                    <div className="h-56 overflow-hidden bg-slate-900 relative w-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/prog_engineering.png"; }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        draggable="false"
                        loading="lazy"
                      />
                      {closed && (
                        <div className="absolute top-4 right-4 bg-gray-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">
                          Registration Closed
                        </div>
                      )}
                      <span className="absolute bottom-4 left-4 text-[10px] font-black text-white bg-[#F97316] py-1 px-3 rounded-lg uppercase tracking-wider shadow-sm">
                        {item.category}
                      </span>
                    </div>
                    {/* Content Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between w-full">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1 text-[10px] text-gray-400 font-semibold uppercase">
                          <div className="flex items-center gap-1">
                            <Calendar size={11} className="text-[#F97316]" />
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={11} className="text-[#F97316]" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                        <h4 className="text-base font-extrabold text-[#072A6C] leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-light font-[var(--font-inter)]">
                          {item.bodyText}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-50 mt-5 flex justify-between items-center text-xs font-bold text-[#072A6C] group-hover:text-[#D4AF37] transition-colors">
                        <span>{closed ? "View Details" : "Register Now"}</span>
                        <ArrowRight size={14} className={closed ? "text-gray-400" : "text-[#F97316] group-hover:translate-x-1 transition-transform"} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Centered directory link */}
        <div className="flex justify-center mt-12">
          <Link
            to="/news/events/all"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#072A6C] hover:bg-[#D4AF37] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>Explore All Events Archive</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
