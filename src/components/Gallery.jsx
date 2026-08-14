import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

export const compoundImages = [
  { src: "/images/buildings.jfif", label: "المباني" },
  { src: "/images/buildings%202.jfif", label: "المباني" },
  { src: "/images/garden.jfif", label: "الحديقة" },
  { src: "/images/garden%202.jfif", label: "الحديقة" },
  { src: "/images/pool.jpeg", label: "المسبح" },
];

export default function Gallery({ images, activeIndex, onOpen, onClose, onNavigate }) {
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((activeIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % images.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, onNavigate]);

  return (
    <section className="mx-auto mb-2 max-w-2xl px-4">
      <div className="mb-2 flex items-center gap-2 px-1 text-lg font-bold text-slate-700">
        <Images size={20} />
        صور الكمبوند
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, index) => (
          <button
            key={img.src}
            onClick={() => onOpen(index)}
            className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 transition active:scale-95"
          >
            <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-black/40 px-2 py-1 text-xs font-semibold text-white">
              {img.label}
            </span>
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="إغلاق"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="السابق"
          >
            <ChevronLeft size={28} />
          </button>

          <img
            src={images[activeIndex].src}
            alt={images[activeIndex].label}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex + 1) % images.length);
            }}
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="التالي"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-sm font-semibold text-white">
            {images[activeIndex].label} — {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
