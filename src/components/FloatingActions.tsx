import { useState, useEffect } from "react";
import { useSite } from "@/context/SiteContext";
import { CalendarCheck, MessageSquare, ChevronUp } from "lucide-react";
import { cn } from "@/utils/cn";

export default function FloatingActions() {
  const { openSiteTrippingModal, settings } = useSite();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 550);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop & Tablet Floating Quick Dock */}
      <div
        className={cn(
          "fixed right-5 bottom-6 z-40 hidden flex-col items-end gap-2.5 transition-all duration-500 sm:flex",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <button
          type="button"
          onClick={scrollToTop}
          className="grid h-9 w-9 place-items-center rounded-full border border-highlands-900/10 bg-white text-highlands-900 shadow-md backdrop-blur-md transition-all hover:bg-cream-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        <a
          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Jewel,%20I'm%20interested%20in%20visiting%20Tagaytay%20Highlands.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full border border-highlands-600/30 bg-white/95 px-4 py-2.5 text-xs font-semibold text-highlands-800 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-highlands-50"
          title="Chat with Jewel on WhatsApp"
        >
          <MessageSquare className="h-4 w-4 text-highlands-600" />
          <span>Chat with Jewel</span>
        </a>

        <button
          type="button"
          onClick={() => openSiteTrippingModal()}
          className="group flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-5 py-3 text-xs font-semibold text-highlands-950 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Book Free Site Tripping</span>
        </button>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-highlands-900/10 bg-white/95 px-4 py-3 backdrop-blur-xl transition-all duration-500 sm:hidden shadow-lg",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <div className="flex items-center gap-2.5">
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Jewel,%20I'd%20like%20to%20inquire%20about%20Tagaytay%20Highlands.`}
            target="_blank"
            rel="noreferrer"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-highlands-600/30 bg-highlands-50 text-highlands-700 shadow-xs"
            aria-label="WhatsApp Jewel"
          >
            <MessageSquare className="h-5 w-5" />
          </a>

          <button
            type="button"
            onClick={() => openSiteTrippingModal()}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-3 text-center text-xs font-semibold text-highlands-950 shadow-md"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Book VIP Site Tripping</span>
          </button>
        </div>
      </div>
    </>
  );
}
