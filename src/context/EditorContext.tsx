import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSite } from "./SiteContext";
import { buildSnapshot } from "@/utils/cloudSync";

type EditorContextType = {
  isEditMode: boolean;
  enterEditMode: () => void;
  exitEditMode: () => void;
  pending: Record<string, string>;
  setPending: (key: string, value: string) => void;
  removePending: (key: string) => void;
  hasPending: boolean;
  pendingCount: number;
  saveAll: () => void;
  discardAll: () => void;
  saving: boolean;
};

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const { properties, settings, leads, reviews, updateSettings, syncNow } = useSite();
  const [isEditMode, setIsEditMode] = useState(false);
  const [pending, setPendingState] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const enterEditMode = () => setIsEditMode(true);
  const exitEditMode = () => {
    setIsEditMode(false);
    setPendingState({});
  };

  const setPending = (key: string, value: string) =>
    setPendingState((prev) => ({ ...prev, [key]: value }));
  const removePending = (key: string) =>
    setPendingState((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const pendingCount = Object.keys(pending).length;
  const hasPending = pendingCount > 0;

  const saveAll = () => {
    setSaving(true);
    const contentOverrides = { ...(settings.contentOverrides || {}) };
    const imageOverrides = { ...(settings.imageOverrides || {}) };
    const nextSettings = {
      ...settings,
      contentOverrides,
      imageOverrides,
    };

    Object.entries(pending).forEach(([key, value]) => {
      if (key.startsWith("img:")) {
        imageOverrides[key.slice(4)] = value;
      } else {
        contentOverrides[key] = value;
      }
    });

    updateSettings({ contentOverrides, imageOverrides });
    void syncNow(buildSnapshot(properties, nextSettings, leads, reviews));
    setPendingState({});
    setTimeout(() => setSaving(false), 600);
  };

  const discardAll = () => setPendingState({});

  // In edit mode, clicking a BUTTON on the page must not trigger its normal action
  // (so Jewel can click/edit text that lives inside buttons). Clicks on the editor
  // chrome (toolbar / pickers, marked with data-editor-chrome) still work.
  useEffect(() => {
    if (!isEditMode) return;

    const interceptor = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-editor-chrome]")) return;
      if (target.closest("button")) {
        e.stopPropagation();
      }
    };

    document.addEventListener("click", interceptor, true);
    return () => document.removeEventListener("click", interceptor, true);
  }, [isEditMode]);

  return (
    <EditorContext.Provider
      value={{
        isEditMode,
        enterEditMode,
        exitEditMode,
        pending,
        setPending,
        removePending,
        hasPending,
        pendingCount,
        saveAll,
        discardAll,
        saving,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
