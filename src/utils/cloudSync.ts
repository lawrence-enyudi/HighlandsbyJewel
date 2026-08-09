import { supabase } from "@/lib/supabase";
import type {
  OwnershipTier,
  ProjectFile,
  Property,
  SiteReview,
  SiteSettings,
  SiteTrippingLead,
} from "@/context/SiteContext";

export const SITE_SETTINGS_TABLE = "site_settings";
export const PROPERTIES_TABLE = "properties";
export const LEADS_TABLE = "leads";
export const REVIEWS_TABLE = "reviews";
export const OWNERSHIP_TIERS_TABLE = "ownership_tiers";
export const PROJECTS_TABLE = "projects";

// Keep a single canonical settings row so every device reads/writes the same record.
export const SITE_SETTINGS_ROW_ID = "11111111-1111-1111-1111-111111111111";

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
  projects: ProjectFile[];
  settings: SiteSettings;
};

type SiteSettingsRow = {
  id: string;
  data: SiteSettings;
  updated_at?: string;
};

type PropertyRow = {
  id: string;
  data: Property;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type LeadRow = {
  id: string;
  data: SiteTrippingLead;
  status?: SiteTrippingLead["status"] | null;
  created_at?: string | null;
};

type ReviewRow = {
  id: string;
  name: string;
  location?: string | null;
  rating: number;
  quote: string;
  approved: boolean;
  created_at?: string | null;
};

type OwnershipTierRow = {
  id: string;
  data: OwnershipTier;
  sort_order?: number | null;
};

type ProjectRow = {
  id: string;
  data: ProjectFile;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export function buildSnapshot(
  properties: Property[],
  settings: SiteSettings,
  leads: SiteTrippingLead[],
  reviews: SiteReview[],
  projects: ProjectFile[] = [],
): SyncSnapshot {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    properties,
    leads,
    reviews,
    projects,
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

function latestIso(values: Array<string | null | undefined>): string {
  const times = values
    .filter((v): v is string => Boolean(v))
    .map((v) => new Date(v).getTime())
    .filter((n) => Number.isFinite(n));
  if (!times.length) return new Date().toISOString();
  return new Date(Math.max(...times)).toISOString();
}

async function loadCanonicalSettingsRow(): Promise<SiteSettingsRow | null> {
  const directResult = await supabase
    .from(SITE_SETTINGS_TABLE)
    .select("id, data, updated_at")
    .eq("id", SITE_SETTINGS_ROW_ID)
    .maybeSingle();

  if (!directResult.error && directResult.data) {
    return directResult.data as SiteSettingsRow;
  }

  const fallbackResult = await supabase
    .from(SITE_SETTINGS_TABLE)
    .select("id, data, updated_at")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (fallbackResult.error || !fallbackResult.data) {
    return null;
  }

  return fallbackResult.data as SiteSettingsRow;
}

export async function loadSharedSnapshot(): Promise<SyncSnapshot | null> {
  const [settingsResult, propertiesResult, leadsResult, reviewsResult, tiersResult, projectsResult] =
    await Promise.all([
      loadCanonicalSettingsRow(),
      supabase
        .from(PROPERTIES_TABLE)
        .select("id, data, sort_order, created_at, updated_at")
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true, nullsFirst: false }),
      supabase
        .from(LEADS_TABLE)
        .select("id, data, status, created_at")
        .order("created_at", { ascending: false, nullsFirst: false }),
      supabase
        .from(REVIEWS_TABLE)
        .select("id, name, location, rating, quote, approved, created_at")
        .order("created_at", { ascending: false, nullsFirst: false }),
      supabase
        .from(OWNERSHIP_TIERS_TABLE)
        .select("id, data, sort_order")
        .order("sort_order", { ascending: true, nullsFirst: false }),
      supabase
        .from(PROJECTS_TABLE)
        .select("id, data, sort_order, created_at, updated_at")
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true, nullsFirst: false }),
    ]);

  if (!settingsResult) {
    return null;
  }

  if (propertiesResult.error) {
    throw new Error(propertiesResult.error.message);
  }
  if (leadsResult.error) {
    throw new Error(leadsResult.error.message);
  }
  if (reviewsResult.error) {
    throw new Error(reviewsResult.error.message);
  }

  const projectRows = projectsResult.error
    ? []
    : ((projectsResult.data as ProjectRow[] | null | undefined) || []);

  const settings = {
    ...settingsResult.data,
    ownershipTiers:
      (settingsResult.data?.ownershipTiers as OwnershipTier[] | undefined) ||
      (tiersResult.error
        ? []
        : ((tiersResult.data as OwnershipTierRow[] | null | undefined)?.map((row) => row.data) || [])),
  } as SiteSettings;

  const propertyRows = (propertiesResult.data as PropertyRow[] | null | undefined) || [];
  const leadRows = (leadsResult.data as LeadRow[] | null | undefined) || [];
  const reviewRows = (reviewsResult.data as ReviewRow[] | null | undefined) || [];
  const latestUpdatedAt = latestIso([
    settingsResult.updated_at,
    ...propertyRows.flatMap((row) => [row.updated_at, row.created_at]),
    ...leadRows.map((row) => row.created_at),
    ...reviewRows.map((row) => row.created_at),
    ...projectRows.flatMap((row) => [row.updated_at, row.created_at]),
  ]);

  return {
    version: 1,
    updatedAt: latestUpdatedAt,
    properties: propertyRows.map((row) => ({
      ...row.data,
      id: row.id,
    })),
    leads: leadRows.map((row) => ({
      ...row.data,
      id: row.id,
      status: row.status || row.data.status,
      createdAt: row.created_at || row.data.createdAt || new Date().toISOString(),
    })),
    reviews: reviewRows.map((row) => ({
      id: row.id,
      name: row.name,
      location: row.location || undefined,
      rating: row.rating,
      quote: row.quote,
      approved: row.approved,
      createdAt: row.created_at || new Date().toISOString(),
    })),
    projects: projectRows.map((row) => ({
      ...row.data,
      id: row.id,
    })),
    settings,
  };
}

export async function saveSharedSnapshot(snapshot: SyncSnapshot): Promise<void> {
  const [existingProperties, existingLeads, existingReviews, existingTiers, existingProjects, existingSettings] =
    await Promise.all([
      supabase.from(PROPERTIES_TABLE).select("id"),
      supabase.from(LEADS_TABLE).select("id"),
      supabase.from(REVIEWS_TABLE).select("id"),
      supabase.from(OWNERSHIP_TIERS_TABLE).select("id"),
      supabase.from(PROJECTS_TABLE).select("id"),
      supabase.from(SITE_SETTINGS_TABLE).select("id").eq("id", SITE_SETTINGS_ROW_ID).maybeSingle(),
    ]);

  if (existingProperties.error) throw new Error(existingProperties.error.message);
  if (existingLeads.error) throw new Error(existingLeads.error.message);
  if (existingReviews.error) throw new Error(existingReviews.error.message);
  if (existingTiers.error) throw new Error(existingTiers.error.message);
  if (existingProjects.error) throw new Error(existingProjects.error.message);
  if (existingSettings.error) throw new Error(existingSettings.error.message);

  const propertyRows: PropertyRow[] = snapshot.properties.map((property, index) => ({
    id: property.id,
    data: property,
    sort_order: index,
    created_at: new Date().toISOString(),
    updated_at: snapshot.updatedAt,
  }));

  const leadRows: LeadRow[] = snapshot.leads.map((lead) => ({
    id: lead.id,
    data: lead,
    status: lead.status,
    created_at: lead.createdAt,
  }));

  const reviewRows: ReviewRow[] = snapshot.reviews.map((review) => ({
    id: review.id,
    name: review.name,
    location: review.location || null,
    rating: review.rating,
    quote: review.quote,
    approved: review.approved,
    created_at: review.createdAt,
  }));

  const ownershipTierRows: OwnershipTierRow[] = (snapshot.settings.ownershipTiers || []).map(
    (tier, index) => ({
      id: tier.id,
      data: tier,
      sort_order: index,
    }),
  );

  const projectRows: ProjectRow[] = (snapshot.projects || []).map((project, index) => ({
    id: project.id,
    data: project,
    sort_order: index,
    created_at: project.createdAt,
    updated_at: project.updatedAt || snapshot.updatedAt,
  }));

  const settingsRow: SiteSettingsRow = {
    id: SITE_SETTINGS_ROW_ID,
    data: snapshot.settings,
    updated_at: snapshot.updatedAt,
  };

  const saveRows = async <T extends { id: string }>(
    table: string,
    existingIds: string[],
    nextRows: T[],
  ) => {
    if (!nextRows.length) return;
    const existingIdSet = new Set(existingIds);
    const operations = nextRows.map(async (row) => {
      if (existingIdSet.has(row.id)) {
        const { error } = await supabase.from(table).update(row).eq("id", row.id);
        if (error) throw new Error(error.message);
        return;
      }
      const { error } = await supabase.from(table).insert(row);
      if (error) throw new Error(error.message);
    });
    await Promise.all(operations);
  };

  if (existingSettings.data) {
    const { error } = await supabase.from(SITE_SETTINGS_TABLE).update(settingsRow).eq("id", SITE_SETTINGS_ROW_ID);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from(SITE_SETTINGS_TABLE).insert(settingsRow);
    if (error) throw new Error(error.message);
  }

  await Promise.all([
    saveRows(
      PROPERTIES_TABLE,
      ((existingProperties.data || []) as { id: string }[]).map((row) => row.id),
      propertyRows,
    ),
    saveRows(
      LEADS_TABLE,
      ((existingLeads.data || []) as { id: string }[]).map((row) => row.id),
      leadRows,
    ),
    saveRows(
      REVIEWS_TABLE,
      ((existingReviews.data || []) as { id: string }[]).map((row) => row.id),
      reviewRows,
    ),
    saveRows(
      OWNERSHIP_TIERS_TABLE,
      ((existingTiers.data || []) as { id: string }[]).map((row) => row.id),
      ownershipTierRows,
    ),
    saveRows(
      PROJECTS_TABLE,
      ((existingProjects.data || []) as { id: string }[]).map((row) => row.id),
      projectRows,
    ),
  ]);
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
