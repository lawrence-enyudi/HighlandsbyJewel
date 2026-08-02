import type { SiteSettings } from "@/context/SiteContext";

function normalizeImageKey(key: string): string {
  return key.startsWith("img:") ? key.slice(4) : key;
}

/**
 * Resolve a live-edited text field.
 * Priority: pending (unsaved) edits → saved overrides → default value.
 */
export function resolveField(
  settings: SiteSettings,
  key: string,
  fallback: string,
  pending?: Record<string, string>,
): string {
  if (pending && pending[key]) return pending[key];
  return settings.contentOverrides?.[key] ?? fallback;
}

/**
 * Resolve a live-edited image field.
 * Priority: pending (unsaved) edits → saved overrides → default value.
 */
export function resolveImage(
  settings: SiteSettings,
  key: string,
  fallback: string,
  pending?: Record<string, string>,
): string {
  const normalized = normalizeImageKey(key);
  if (pending) {
    if (pending[`img:${normalized}`]) return pending[`img:${normalized}`];
    // Backward-compatibility for previously staged keys that still include img:
    if (pending[`img:${key}`]) return pending[`img:${key}`];
  }
  return (
    settings.imageOverrides?.[normalized] ??
    settings.imageOverrides?.[key] ??
    settings.imageOverrides?.[`img:${normalized}`] ??
    fallback
  );
}
