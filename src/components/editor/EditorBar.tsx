import { useEditor } from "@/context/EditorContext";
import { useSite } from "@/context/SiteContext";
import { Check, X, Save, Pencil, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function EditorBar() {
  const { isEditMode, hasPending, pendingCount, saveAll, discardAll, exitEditMode, saving } =
    useEditor();
  const { logoutAdmin } = useSite();

  if (!isEditMode) return null;

  const handleExit = async () => {
    // Save anything pending first, then fully exit (also clears the editor session)
    if (hasPending) {
      await saveAll();
    }
    exitEditMode();
    logoutAdmin();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[110]" data-editor-chrome>
      {/* Top banner */}
      <div className="bg-highlands-900 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs">
        <Pencil className="h-3.5 w-3.5 text-gold-300" />
        <span className="font-semibold">
          LIVE PAGE EDITOR — Click any text to change words, click any photo to replace it.
        </span>
      </div>

      {/* Action bar */}
      <div className="border-t border-white/10 bg-white/95 backdrop-blur-xl px-4 py-3 shadow-[0_-8px_30px_-10px_rgba(14,42,30,0.25)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-pine-700 font-medium">
            <span
              className={cn(
                "grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold",
                hasPending ? "bg-gold-400 text-highlands-950" : "bg-cream-100 text-pine-600",
              )}
            >
              {pendingCount}
            </span>
            {hasPending ? "unsaved changes" : "no changes yet"}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={discardAll}
              disabled={!hasPending}
              className="flex items-center gap-1.5 rounded-full border border-highlands-900/15 bg-white px-4 py-2 text-xs font-semibold text-highlands-900 transition-colors hover:bg-cream-50 disabled:opacity-40"
            >
              <X className="h-3.5 w-3.5" /> Discard
            </button>

            <button
              type="button"
              onClick={saveAll}
              disabled={!hasPending || saving}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all",
                hasPending
                  ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-md hover:-translate-y-0.5"
                  : "bg-highlands-100 text-highlands-700",
              )}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {saving ? "Saving..." : hasPending ? `Save All (${pendingCount})` : "Saved"}
            </button>

            <button
              type="button"
              onClick={handleExit}
              className="flex items-center gap-1.5 rounded-full bg-highlands-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-highlands-800"
            >
              <Check className="h-3.5 w-3.5 text-gold-300" /> Save &amp; Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
