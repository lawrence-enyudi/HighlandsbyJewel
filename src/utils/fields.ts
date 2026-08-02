import type { SiteSettings } from "@/context/SiteContext";

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
  if (pending && pending[`img:${key}`]) return pending[`img:${key}`];
  return settings.imageOverrides?.[key] ?? fallback;
}
