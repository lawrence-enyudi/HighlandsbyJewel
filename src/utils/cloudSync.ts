import type { SiteSettings, Property, SiteTrippingLead } from "@/context/SiteContext";

/**
 * Public bin ID used by ALL VISITORS to hydrate the latest published edits.
 * Leave "" if you don't use the visitor-live feature. See Seller's Portal →
 * Cloud Backup & Restore tab for instructions.
 */
export const PUBLIC_BIN_ID = "";

export type CloudConfig = {
  enabled: boolean;
  apiKey: string;
  binId: string;
};

/**
 * Payload stored in the cloud. Sensitive fields (adminPin, cloud config,
 * API keys) are intentionally EXCLUDED.
 */
export type SyncPayload = {
  version: number;
  updatedAt: string;
  properties: Property[];
  leads: SiteTrippingLead[];
  contentOverrides: Record<string, string>;
  imageOverrides: Record<string, string>;
  settings: Omit<SiteSettings, "adminPin" | "cloudSync">;
};

const API = "https://api.jsonbin.io/v3/b";

function headers(apiKey?: string): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) h["X-Master-Key"] = apiKey;
  return h;
}

export async function createBin(apiKey: string, payload: SyncPayload): Promise<string> {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Create bin failed (${res.status})`);
  const data = await res.json();
  return data.metadata?.id as string;
}

export async function updateBin(apiKey: string, binId: string, payload: SyncPayload): Promise<void> {
  const res = await fetch(`${API}/${binId}`, {
    method: "PUT",
    headers: headers(apiKey),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Update bin failed (${res.status})`);
}

/** Read the bin — works with a public bin (no key) or with the master key. */
export async function readBin(binId: string, apiKey?: string): Promise<SyncPayload | null> {
  const attempts: Array<{ name: string; key?: string }> = [
    { name: "public", key: undefined },
    ...(apiKey ? [{ name: "key", key: apiKey }] : []),
  ];
  for (const a of attempts) {
    try {
      const res = await fetch(`${API}/${binId}/latest`, { headers: headers(a.key) });
      if (!res.ok) continue;
      const data = await res.json();
      const record = data?.record as SyncPayload | undefined;
      if (record && record.version) return record;
    } catch {
      // try next
    }
  }
  return null;
}

export function buildPayload(
  properties: Property[],
  settings: SiteSettings,
  leads: SiteTrippingLead[],
): SyncPayload {
  const { adminPin: _adminPin, cloudSync: _cloud, ...restSettings } = settings;
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    properties,
    leads,
    contentOverrides: settings.contentOverrides || {},
    imageOverrides: settings.imageOverrides || {},
    settings: restSettings,
  };
}

export function mergePayload(
  payload: SyncPayload,
  current: SiteSettings,
): Partial<SiteSettings> {
  return {
    ...payload.settings,
    contentOverrides: payload.contentOverrides || {},
    imageOverrides: payload.imageOverrides || {},
    // Preserve sensitive local-only fields
    adminPin: current.adminPin,
  };
}

/** Estimate JSON size to stay under the JSONBin free-tier 100KB limit. */
export function payloadSize(payload: SyncPayload): number {
  try {
    return new Blob([JSON.stringify(payload)]).size;
  } catch {
    return JSON.stringify(payload).length;
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
