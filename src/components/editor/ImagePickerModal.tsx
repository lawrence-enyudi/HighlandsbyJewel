import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { X, Upload, Camera, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { fileToCompressedDataUrl } from "@/utils/cloudSync";

const GLOBAL_PRESETS = [
  { name: "Misty Ridge Vista", url: "https://images.pexels.com/photos/19739231/pexels-photo-19739231.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200" },
  { name: "Fairway Greens", url: "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Pine Forest Hills", url: "https://images.pexels.com/photos/6346492/pexels-photo-6346492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Mountain Resort Pool", url: "https://images.pexels.com/photos/18971223/pexels-photo-18971223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Cedar Cabin Exterior", url: "https://images.pexels.com/photos/7746922/pexels-photo-7746922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Modern Interior Living", url: "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Taal View Terrace", url: "https://images.pexels.com/photos/19075380/pexels-photo-19075380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
  { name: "Golf Clubhouse Lawn", url: "https://images.pexels.com/photos/35075337/pexels-photo-35075337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" },
];

export default function ImagePickerModal({
  currentImage,
  onSelect,
  onClose,
  label,
  presets = GLOBAL_PRESETS,
}: {
  currentImage?: string;
  onSelect: (dataUrl: string) => void;
  onClose: () => void;
  label: string;
  presets?: { name: string; url: string }[];
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onSelect(dataUrl);
    } catch {
      // fallback to raw file read
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) onSelect(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Replace photo: ${label}`}
      data-editor-chrome
    >
      <div className="fixed inset-0 bg-highlands-950/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="animate-scale-in relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-highlands-900/10 bg-white p-6 shadow-2xl text-highlands-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-highlands-900/8 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gold-700" />
            <h3 className="font-display text-lg font-normal text-highlands-900">
              Replace Photo — {label}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-cream-50 text-highlands-900 hover:bg-cream-100"
            aria-label="Close image picker"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current preview */}
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase text-pine-600 tracking-wider">Current Photo</p>
          <img
            src={currentImage}
            alt="Current"
            className="mt-1.5 h-32 w-full rounded-xl object-cover border border-highlands-900/10 shadow-2xs"
          />
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300",
            isDragging
              ? "border-gold-500 bg-gold-50 scale-[1.01]"
              : "border-highlands-900/15 bg-cream-50/70 hover:border-gold-500 hover:bg-cream-50",
          )}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
          <Upload className="h-7 w-7 text-gold-700" />
          <p className="mt-2 text-xs font-bold text-highlands-900">
            Drop photo here, or click to attach
          </p>
          <p className="mt-1 text-[11px] text-pine-600">
            JPG, PNG, WebP from your phone or computer
          </p>
        </div>

        {/* Presets */}
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase text-pine-600 tracking-wider">
            Or choose a preset photo
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => onSelect(p.url)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-highlands-900/10 shadow-2xs transition-all hover:border-gold-500"
                title={p.name}
              >
                <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-highlands-950/0 text-white opacity-0 transition-all group-hover:bg-highlands-950/50 group-hover:opacity-100">
                  <Check className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full border border-highlands-900/15 bg-white py-2.5 text-sm font-semibold text-highlands-900 transition-colors hover:bg-cream-50"
        >
          Done
        </button>
      </div>
    </div>
  );
}
