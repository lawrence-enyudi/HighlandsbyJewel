import { useState, type ElementType } from "react";
import { useEditor } from "@/context/EditorContext";
import { useSite } from "@/context/SiteContext";
import { resolveField, resolveImage } from "@/utils/fields";
import { cn } from "@/utils/cn";
import { Pencil, Camera } from "lucide-react";
import ImagePickerModal from "./ImagePickerModal";

/**
 * EditableText — click any text on the landing page (in edit mode) to
 * change it inline. Changes are staged and applied on "Save All Changes".
 *
 * IMPORTANT: When NOT in edit mode, it renders the RESOLVED value
 * (saved override or fallback) so edits persist for good.
 */
export function EditableText({
  field,
  value,
  className,
  as: Tag = "span",
}: {
  field: string;
  value: string;
  className?: string;
  as?: ElementType;
}) {
  const { isEditMode, pending, setPending } = useEditor();
  const { settings } = useSite();
  const resolved = resolveField(settings, field, value, pending);

  if (!isEditMode) {
    return <Tag className={className}>{resolved}</Tag>;
  }

  return (
    <span className="group relative inline-block">
      <Tag
        className={cn(
          className,
          "cursor-text rounded px-0.5 outline-1 outline-dashed outline-gold-500/70 hover:outline-gold-600 focus:bg-gold-50/60 focus:outline-2",
        )}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const next = (e.currentTarget.textContent || "").trim();
          if (next && next !== resolved) setPending(field, next);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === "Escape") (e.currentTarget as HTMLElement).blur();
        }}
      >
        {resolved}
      </Tag>

      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="pointer-events-none absolute -top-3 -right-3 z-20 hidden h-5 w-5 place-items-center rounded-full bg-gold-500 text-highlands-950 shadow-md group-hover:grid"
        title="Click text to edit inline"
      >
        <Pencil className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

/**
 * EditableImage — click any photo on the landing page (in edit mode) to
 * replace it via drag & drop upload or preset picker.
 *
 * IMPORTANT: When NOT in edit mode, it renders the RESOLVED image
 * (saved override or fallback) so replacements persist for good.
 */
export function EditableImage({
  field,
  src,
  alt,
  className,
  imgClassName,
  presets,
  children,
}: {
  field: string;
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  presets?: { name: string; url: string }[];
  children?: React.ReactNode;
}) {
  const { isEditMode, pending, setPending } = useEditor();
  const { settings } = useSite();
  const resolved = resolveImage(settings, field, src, pending);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!isEditMode) {
    return (
      <div className={className}>
        <img src={resolved} alt={alt} className={imgClassName} />
        {children}
      </div>
    );
  }

  return (
    <>
      <div
        className={cn("group/img relative cursor-pointer", className)}
        onClick={() => setPickerOpen(true)}
        title="Click to replace this photo"
      >
        <img src={resolved} alt={alt} className={cn(imgClassName, "pointer-events-none")} />
        {children}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-highlands-950/55 text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover/img:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-highlands-900 shadow-md">
            <Camera className="h-3.5 w-3.5 text-gold-700" /> Click to Replace Photo
          </span>
        </div>
      </div>

      {pickerOpen && (
        <ImagePickerModal
          currentImage={resolved}
          label={alt || field}
          presets={presets}
          onSelect={(url) => {
            const normalized = field.startsWith("img:") ? field.slice(4) : field;
            setPending(`img:${normalized}`, url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
