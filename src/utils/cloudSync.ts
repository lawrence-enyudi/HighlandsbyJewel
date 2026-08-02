import { supabase } from "@/lib/supabase";
import type { Property, SiteReview, SiteSettings, SiteTrippingLead } from "@/context/SiteContext";

export const SITE_STATE_ID = "tagaytay-highlands-by-jewel";
export const SITE_STATE_TABLE = "site_state";

export type CloudConfig = {
  enabled?: boolean;
  apiKey?: string;
  binId?: string;
};

export type SyncSnapshot = {
  version: number;
  updatedAt: string;
  properties: Property[];
  leads: SiteTrippingLead[];
  reviews: SiteReview[];
  settings: SiteSettings;
};

export type SiteStateRow = SyncSnapshot & {
  id: string;
  updated_at?: string;
};

export function buildSnapshot(
  properties: Property[],
  settings: SiteSettings,
  leads: SiteTrippingLead[],
  reviews: SiteReview[],
): SyncSnapshot {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    properties,
    leads,
    reviews,
    settings,
  };
}

export function mergeSnapshot(snapshot: SyncSnapshot, current: SiteSettings): Partial<SiteSettings> {
  return {
    ...snapshot.settings,
    contentOverrides: snapshot.settings.contentOverrides || {},
    imageOverrides: snapshot.settings.imageOverrides || {},
    adminPin: snapshot.settings.adminPin || current.adminPin,
  };
}

export async function loadSharedSnapshot(): Promise<SyncSnapshot | null> {
  const { data, error } = await supabase
    .from(SITE_STATE_TABLE)
    .select("id, version, updated_at, properties, leads, reviews, settings")
    .eq("id", SITE_STATE_ID)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    version: data.version,
    updatedAt: data.updated_at || new Date().toISOString(),
    properties: data.properties,
    leads: data.leads,
    reviews: data.reviews,
    settings: data.settings,
  };
}

export async function saveSharedSnapshot(snapshot: SyncSnapshot): Promise<void> {
  const row: SiteStateRow = {
    id: SITE_STATE_ID,
    updated_at: snapshot.updatedAt,
    ...snapshot,
  };

  const { error } = await supabase.from(SITE_STATE_TABLE).upsert(row, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }
}

export function snapshotSize(snapshot: SyncSnapshot): number {
  try {
    return new Blob([JSON.stringify(snapshot)]).size;
  } catch {
    return JSON.stringify(snapshot).length;
  }
}

/**
 * Compress an image file client-side (used for drag & drop uploads) so
 * backups and cloud payloads stay small.
 */
export async function fileToCompressedDataUrl(
  file: File,
  maxDim = 1100,
  quality = 0.8,
): Promise<string> {
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("Not an image"));
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas unavailable"));
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}
