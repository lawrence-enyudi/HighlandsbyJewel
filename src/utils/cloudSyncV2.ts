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

// New V2 tables
export const PROJECTS_TABLE_V2 = "projects_v2";
export const PROJECT_IMAGES_TABLE = "project_images";
export const PAYMENT_TERMS_TABLE = "payment_terms";
export const INVENTORY_TABLE = "inventory";

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

// V2 Project tables
type ProjectV2Row = {
  id: string;
  name: string;
  district: string;
  category: string;
  status: string;
  price_range: string | null;
  lot_sizes: string | null;
  notes: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

type ProjectImageRow = {
  id: string;
  project_id: string;
  image_type: string;
  image_url: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
};

type PaymentTermRow = {
  id: string;
  project_id: string;
  label: string;
  is_preset: boolean;
  term_discount_percent: number;
  extra_discount_percent: number;
  other_charges_percent: number;
  spot_percent: number;
  dp_spread_percent: number | null;
  dp_spread_months: number | null;
  balance_type: string;
  balance_months: number;
  interest_rate: number;
  reservation_fee: number;
  notes: string | null;
  conditions: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type InventoryRow = {
  id: string;
  project_id: string;
  kind: string;
  block: string | null;
  lot: string | null;
  unit_number: string | null;
  area: string;
  status: string;
  tcp: number;
  remarks: string | null;
  created_at: string;
  updated_at: string;
};

export function buildSnapshot(
  properties: Property[],
  settings: SiteSettings,
  leads: SiteTrippingLead[],
  reviews: SiteReview[],
  projects: ProjectFile[] = [],
): SyncSnapshot {
  return {
    version: 2, // Updated version for V2 schema
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

async function loadProjectsV2(): Promise<ProjectFile[]> {
  // Load projects with their related data
  const { data: projects, error: projectsError } = await supabase
    .from(PROJECTS_TABLE_V2)
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true, nullsFirst: false });

  if (projectsError || !projects) return [];

  const projectFiles: ProjectFile[] = [];

  for (const project of projects) {
    // Load images for this project
    const { data: images } = await supabase
      .from(PROJECT_IMAGES_TABLE)
      .select("*")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true });

    // Load payment terms for this project
    const { data: paymentTerms } = await supabase
      .from(PAYMENT_TERMS_TABLE)
      .select("*")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true });

    // Load inventory for this project
    const { data: inventory } = await supabase
      .from(INVENTORY_TABLE)
      .select("*")
      .eq("project_id", project.id);

    // Process images
    const mapImages = (images || [])
      .filter(img => img.image_type === 'map')
      .map(img => img.image_url);
    const priceListImages = (images || [])
      .filter(img => img.image_type === 'price_list')
      .map(img => img.image_url);

    // Process payment terms
    const paymentTermsData = (paymentTerms || []).map(term => ({
      id: term.id,
      label: term.label,
      isPreset: term.is_preset,
      termDiscountPercent: term.term_discount_percent,
      extraDiscountPercent: term.extra_discount_percent,
      otherChargesPercent: term.other_charges_percent,
      spotPercent: term.spot_percent,
      dpSpreadPercent: term.dp_spread_percent,
      dpSpreadMonths: term.dp_spread_months,
      balanceType: term.balance_type as any,
      balanceMonths: term.balance_months,
      interestRate: term.interest_rate,
      reservationFee: term.reservation_fee,
      notes: term.notes || '',
      conditions: term.conditions,
    }));

    // Process inventory
    const inventoryData = (inventory || []).map(inv => ({
      id: inv.id,
      kind: inv.kind as any,
      block: inv.block,
      lot: inv.lot,
      unitNumber: inv.unit_number,
      area: inv.area,
      status: inv.status as any,
      tcp: inv.tcp,
      remarks: inv.remarks || '',
      createdAt: inv.created_at,
      updatedAt: inv.updated_at,
    }));

    projectFiles.push({
      id: project.id,
      name: project.name,
      district: project.district,
      category: project.category as any,
      status: project.status as any,
      priceRange: project.price_range || '',
      lotSizes: project.lot_sizes || '',
      mapImages,
      priceListImages,
      paymentTerms: paymentTermsData,
      inventory: inventoryData,
      notes: project.notes || '',
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    });
  }

  return projectFiles;
}

export async function loadSharedSnapshot(): Promise<SyncSnapshot | null> {
  const [settingsResult, propertiesResult, leadsResult, reviewsResult, tiersResult] =
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

  // Load projects using V2 schema
  const projects = await loadProjectsV2();

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
    ...projects.map((p) => p.updatedAt),
  ]);

  return {
    version: 2,
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
    projects,
    settings,
  };
}

async function saveProjectsV2(projects: ProjectFile[]): Promise<void> {
  // Get existing projects
  const { data: existingProjects, error: existingError } = await supabase
    .from(PROJECTS_TABLE_V2)
    .select("id");

  if (existingError) throw new Error(existingError.error);

  const existingIds = new Set((existingProjects || []).map((p: any) => p.id));

  for (const project of projects) {
    const projectData: ProjectV2Row = {
      id: project.id,
      name: project.name,
      district: project.district,
      category: project.category,
      status: project.status,
      price_range: project.priceRange || null,
      lot_sizes: project.lotSizes || null,
      notes: project.notes || null,
      sort_order: projects.indexOf(project),
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    };

    if (existingIds.has(project.id)) {
      // Update existing project
      const { error } = await supabase
        .from(PROJECTS_TABLE_V2)
        .update(projectData)
        .eq("id", project.id);
      if (error) throw new Error(error.message);
    } else {
      // Insert new project
      const { error } = await supabase
        .from(PROJECTS_TABLE_V2)
        .insert(projectData);
      if (error) throw new Error(error.message);
    }

    // Handle images - delete existing and insert new
    await supabase
      .from(PROJECT_IMAGES_TABLE)
      .delete()
      .eq("project_id", project.id);

    // Insert map images
    for (let i = 0; i < project.mapImages.length; i++) {
      const imageUrl = project.mapImages[i];
      const { error } = await supabase
        .from(PROJECT_IMAGES_TABLE)
        .insert({
          project_id: project.id,
          image_type: 'map',
          image_url: imageUrl,
          storage_path: imageUrl, // In production, this would be the actual storage path
          sort_order: i,
        });
      if (error) throw new Error(error.message);
    }

    // Insert price list images
    for (let i = 0; i < project.priceListImages.length; i++) {
      const imageUrl = project.priceListImages[i];
      const { error } = await supabase
        .from(PROJECT_IMAGES_TABLE)
        .insert({
          project_id: project.id,
          image_type: 'price_list',
          image_url: imageUrl,
          storage_path: imageUrl,
          sort_order: i,
        });
      if (error) throw new Error(error.message);
    }

    // Handle payment terms - delete existing and insert new
    await supabase
      .from(PAYMENT_TERMS_TABLE)
      .delete()
      .eq("project_id", project.id);

    for (let i = 0; i < project.paymentTerms.length; i++) {
      const term = project.paymentTerms[i];
      const termData: PaymentTermRow = {
        id: term.id,
        project_id: project.id,
        label: term.label,
        is_preset: term.isPreset || false,
        term_discount_percent: term.termDiscountPercent,
        extra_discount_percent: term.extraDiscountPercent,
        other_charges_percent: term.otherChargesPercent,
        spot_percent: term.spotPercent,
        dp_spread_percent: term.dpSpreadPercent,
        dp_spread_months: term.dpSpreadMonths,
        balance_type: term.balanceType,
        balance_months: term.balanceMonths,
        interest_rate: term.interestRate,
        reservation_fee: term.reservationFee,
        notes: term.notes,
        conditions: term.conditions,
        sort_order: i,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from(PAYMENT_TERMS_TABLE)
        .insert(termData);
      if (error) throw new Error(error.message);
    }

    // Handle inventory - delete existing and insert new
    await supabase
      .from(INVENTORY_TABLE)
      .delete()
      .eq("project_id", project.id);

    for (const unit of project.inventory || []) {
      const inventoryData: InventoryRow = {
        id: unit.id,
        project_id: project.id,
        kind: unit.kind,
        block: unit.block,
        lot: unit.lot,
        unit_number: unit.unitNumber,
        area: unit.area,
        status: unit.status,
        tcp: unit.tcp,
        remarks: unit.remarks,
        created_at: unit.createdAt,
        updated_at: unit.updatedAt,
      };
      const { error } = await supabase
        .from(INVENTORY_TABLE)
        .insert(inventoryData);
      if (error) throw new Error(error.message);
    }
  }

  // Delete projects that no longer exist
  const currentIds = new Set(projects.map(p => p.id));
  for (const existingId of existingIds) {
    if (!currentIds.has(existingId)) {
      const { error } = await supabase
        .from(PROJECTS_TABLE_V2)
        .delete()
        .eq("id", existingId);
      if (error) throw new Error(error.message);
    }
  }
}

export async function saveSharedSnapshot(snapshot: SyncSnapshot): Promise<void> {
  const [existingProperties, existingLeads, existingReviews, existingTiers, existingSettings] =
    await Promise.all([
      supabase.from(PROPERTIES_TABLE).select("id"),
      supabase.from(LEADS_TABLE).select("id"),
      supabase.from(REVIEWS_TABLE).select("id"),
      supabase.from(OWNERSHIP_TIERS_TABLE).select("id"),
      supabase.from(SITE_SETTINGS_TABLE).select("id").eq("id", SITE_SETTINGS_ROW_ID).maybeSingle(),
    ]);

  if (existingProperties.error) throw new Error(existingProperties.error.message);
  if (existingLeads.error) throw new Error(existingLeads.error.message);
  if (existingReviews.error) throw new Error(existingReviews.error.message);
  if (existingTiers.error) throw new Error(existingTiers.error.message);
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
    // Save projects using V2 schema
    saveProjectsV2(snapshot.projects),
  ]);
}

export function snapshotSize(snapshot: SyncSnapshot): number {
  return new Blob([JSON.stringify(snapshot)]).size;
}
