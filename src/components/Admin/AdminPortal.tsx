import { useState, useRef, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import {
  useSite,
  type Property,
  type PropertyCategory,
  type SiteTrippingLead,
  type PropertyPromo,
  type PromoDiscount,
  type OwnershipTier,
} from "@/context/SiteContext";
import { useEditor } from "@/context/EditorContext";
import { calculatePromoPrice } from "@/utils/promo";
import { buildSnapshot, fileToCompressedDataUrl } from "@/utils/cloudSync";
import { OFFICIAL_RESTAURANTS, PLACES_TO_GO } from "@/data/communities";
import {
  X,
  Lock,
  LogOut,
  Building,
  Users,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Compass,
  Plus,
  Trash2,
  Edit2,
  Check,
  Phone,
  MessageSquare,
  Search,
  ExternalLink,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Upload,
  User,
  Flame,
  Clock,
  Tag,
  Images,
  CreditCard,
  Layers,
  Camera,
  Pencil,
  Cloud,
  CloudUpload,
  Download,
  UploadCloud,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/utils/cn";

const PHOTO_PRESETS = [
  {
    name: "Misty Mountain Vista",
    url: "https://images.pexels.com/photos/19739231/pexels-photo-19739231.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200",
  },
  {
    name: "Primrose Parks Modern Summer",
    url: "https://images.pexels.com/photos/12010425/pexels-photo-12010425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  },
  {
    name: "Highlands Residences Resort Condo",
    url: "https://images.pexels.com/photos/7746472/pexels-photo-7746472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  },
  {
    name: "Horizon Terraces Asian Contemporary",
    url: "https://images.pexels.com/photos/7031720/pexels-photo-7031720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  },
  {
    name: "Woodlands Point Cedar Log Cabins",
    url: "https://images.pexels.com/photos/7746922/pexels-photo-7746922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  },
  {
    name: "Trealva Midlands West Eco-Resort",
    url: "https://images.pexels.com/photos/14023023/pexels-photo-14023023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  },
];

const JEWEL_PHOTO_PRESETS = [
  {
    name: "Outdoor Blazer Portrait",
    url: "https://images.pexels.com/photos/6171657/pexels-photo-6171657.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    name: "Corporate Smile Portrait",
    url: "https://images.pexels.com/photos/8101969/pexels-photo-8101969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    name: "Warm Business Casual",
    url: "https://images.pexels.com/photos/37830400/pexels-photo-37830400.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
];

const getDefaultPromo = (daysAhead: number = 7): PropertyPromo => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(23, 59, 0, 0);
  return {
    enabled: false,
    title: "Special Launch Promo",
    discounts: [
      { id: `disc-${Date.now()}-1`, label: "Special Launch Discount", percentage: 30 },
      { id: `disc-${Date.now()}-2`, label: "Spot Cash / Early Bird Promo", percentage: 10 },
    ],
    endsAt: d.toISOString().slice(0, 16),
    badgeText: "",
    customDiscountedPrice: "",
  };
};

function FileDropzone({
  label,
  subtitle,
  currentImage,
  onImageSelected,
  multiple = false,
  className,
}: {
  label: string;
  subtitle?: string;
  currentImage?: string;
  onImageSelected: (dataUrl: string) => void;
  multiple?: boolean;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onImageSelected(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) onImageSelected(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(processFile);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-highlands-900 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[11px] text-gold-700 font-semibold flex items-center gap-1">
          <Camera className="h-3 w-3" /> Attach / Drag Photo
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-300",
          isDragging
            ? "border-gold-500 bg-gold-50 scale-[1.01]"
            : "border-highlands-900/15 bg-cream-50/70 hover:border-gold-500 hover:bg-cream-50",
        )}
      >
        <input
          type="file"
          ref={inputRef}
          multiple={multiple}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />

        {currentImage && (
          <div className="mb-3 h-28 w-full max-w-xs overflow-hidden rounded-xl border border-highlands-900/10 shadow-xs">
            <img src={currentImage} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-gold-700">
          <Upload className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
          <span className="text-xs font-bold text-highlands-900">
            {multiple ? "Click to Attach or Drag Multiple Photos" : "Click to Attach or Drag Photo"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-pine-600">
          {subtitle || "Drop JPG, PNG, WebP image from your phone or computer"}
        </p>
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const {
    isAdminOpen,
    closeAdmin,
    isAuthenticated,
    loginAdmin,
    logoutAdmin,
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    settings,
    updateSettings,
    leads,
    updateLeadStatus,
    deleteLead,
    reviews,
    deleteReview,
    toggleReviewApproval,
    resetAllToDefault,
    syncNow,
    exportBackup,
    importBackup,
    lastSyncedAt,
    syncState,
  } = useSite();

  const { enterEditMode } = useEditor();

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "leads" | "reviews" | "properties" | "communities" | "terms" | "about" | "content" | "media" | "tripping" | "cloud" | "security"
  >("leads");

  // Property modal state
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);
  const [propForm, setPropForm] = useState<Omit<Property, "id">>({
    name: "",
    village: "The Midlands Enclave",
    category: "Lot",
    status: "Available",
    price: "₱14.2M",
    monthly: "₱71,500 / mo",
    area: "520 sqm",
    lotArea: "520 sqm",
    floorArea: "",
    beds: "Custom Build Lot",
    baths: "",
    parking: "",
    furnishing: "",
    elevation: "1,350 ft ASL",
    image: PHOTO_PRESETS[1].url,
    images: [PHOTO_PRESETS[1].url],
    highlights: ["Scenic golf view", "0% interest 60 mo.", "Turnkey turnover"],
    blurb: "Prime location inside Tagaytay Highlands with panoramic mountain vistas.",
    promo: getDefaultPromo(7),
  });

  // Lead search & filter
  const [leadSearch, setLeadSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState<string>("All");

  // Settings form state
  const [tempSettings, setTempSettings] = useState(settings);
  const [saveToast, setSaveToast] = useState(false);

  if (!isAdminOpen) return null;

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    const role = loginAdmin(pinInput);
    if (!role) {
      setPinError(true);
      return;
    }
    setPinError(false);
    setPinInput("");

    // Page Editor PIN → close the dashboard and launch the Live Page Editor
    if (role === "editor") {
      closeAdmin();
      enterEditMode();
    }
  };

  const handleOpenAddProp = () => {
    setEditingProp(null);
    setPropForm({
      name: "",
      village: "The Midlands Enclave",
      category: "Lot",
      status: "Available",
      price: "₱14.5M",
      monthly: "₱72,500 / mo",
      area: "500 sqm",
      lotArea: "500 sqm",
      floorArea: "",
      beds: "Custom Build Lot",
      baths: "",
      parking: "",
      furnishing: "",
      elevation: "1,400 ft ASL",
      image: PHOTO_PRESETS[1].url,
      images: [PHOTO_PRESETS[1].url],
      highlights: ["Scenic mountain view", "0% interest 60 mo.", "Turnkey turnover"],
      blurb: "Prime location in Tagaytay Highlands with panoramic views.",
      promo: getDefaultPromo(7),
    });
    setIsPropModalOpen(true);
  };

  const handleOpenEditProp = (prop: Property) => {
    setEditingProp(prop);

    let promoEndsAt = "";
    if (prop.promo?.endsAt) {
      try {
        promoEndsAt = new Date(prop.promo.endsAt).toISOString().slice(0, 16);
      } catch {
        promoEndsAt = new Date().toISOString().slice(0, 16);
      }
    }

    const currentImages = prop.images && prop.images.length > 0 ? [...prop.images] : [prop.image];

    setPropForm({
      name: prop.name,
      village: prop.village,
      category: prop.category,
      status: prop.status,
      price: prop.price,
      monthly: prop.monthly,
      area: prop.area,
      lotArea: prop.lotArea || prop.area,
      floorArea: prop.floorArea || "",
      beds: prop.beds,
      baths: prop.baths || "",
      parking: prop.parking || "",
      furnishing: prop.furnishing || "",
      elevation: prop.elevation,
      image: prop.image || currentImages[0],
      images: currentImages,
      highlights: [...prop.highlights],
      blurb: prop.blurb,
      promo: prop.promo
        ? {
            ...prop.promo,
            discounts:
              prop.promo.discounts && prop.promo.discounts.length > 0
                ? [...prop.promo.discounts]
                : [{ id: "disc-1", label: "Special Launch Promo", percentage: 30 }],
            endsAt: promoEndsAt || getDefaultPromo(7).endsAt,
          }
        : getDefaultPromo(7),
    });
    setIsPropModalOpen(true);
  };

  const handleAddPropImage = (dataUrl: string) => {
    setPropForm((prev) => {
      const current = prev.images || [prev.image];
      return {
        ...prev,
        images: [...current, dataUrl],
        image: current.length === 0 ? dataUrl : prev.image,
      };
    });
  };

  const handleRemovePropImage = (index: number) => {
    setPropForm((prev) => {
      const current = prev.images || [prev.image];
      const updated = current.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated.length > 0 ? updated : [PHOTO_PRESETS[0].url],
        image: updated[0] || PHOTO_PRESETS[0].url,
      };
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setPropForm((prev) => {
      const current = prev.images || [prev.image];
      const selected = current[index];
      const rest = current.filter((_, i) => i !== index);
      return {
        ...prev,
        image: selected,
        images: [selected, ...rest],
      };
    });
  };

  const handleAddDiscount = () => {
    if (!propForm.promo) return;
    const newDisc: PromoDiscount = {
      id: `disc-${Date.now()}`,
      label: "Additional Promo Discount",
      percentage: 10,
    };
    setPropForm({
      ...propForm,
      promo: {
        ...propForm.promo,
        discounts: [...propForm.promo.discounts, newDisc],
      },
    });
  };

  const handleRemoveDiscount = (discId: string) => {
    if (!propForm.promo) return;
    setPropForm({
      ...propForm,
      promo: {
        ...propForm.promo,
        discounts: propForm.promo.discounts.filter((d) => d.id !== discId),
      },
    });
  };

  const handleUpdateDiscount = (discId: string, updated: Partial<PromoDiscount>) => {
    if (!propForm.promo) return;
    setPropForm({
      ...propForm,
      promo: {
        ...propForm.promo,
        discounts: propForm.promo.discounts.map((d) =>
          d.id === discId ? { ...d, ...updated } : d,
        ),
      },
    });
  };

  const setPromoDaysPreset = (days: number) => {
    if (!propForm.promo) return;
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 0, 0);
    setPropForm({
      ...propForm,
      promo: {
        ...propForm.promo,
        endsAt: d.toISOString().slice(0, 16),
      },
    });
  };

  const handleSaveProp = (e: FormEvent) => {
    e.preventDefault();
    const finalImages =
      propForm.images && propForm.images.length > 0 ? propForm.images : [propForm.image];
    const propertyId = editingProp ? editingProp.id : `prop-${Date.now()}`;
    const finalProp = {
      ...propForm,
      image: finalImages[0] || propForm.image,
      images: finalImages,
    };
    const nextProperties = editingProp
      ? properties.map((prop) => (prop.id === propertyId ? { ...prop, ...finalProp } : prop))
      : [{ ...finalProp, id: propertyId }, ...properties];
    const nextSettings = editingProp
      ? (() => {
          const oi = { ...(settings.imageOverrides || {}) };
          delete oi[`prop.${propertyId}`];
          delete oi[`prop.${propertyId}.detail`];
          return Object.keys(oi).length !== Object.keys(settings.imageOverrides || {}).length
            ? { ...settings, imageOverrides: oi }
            : settings;
        })()
      : settings;
    if (editingProp) {
      updateProperty(propertyId, finalProp);
      // Clear any Live-Editor image override so the portal's photo changes take effect
      const oi = { ...(settings.imageOverrides || {}) };
      delete oi[`prop.${propertyId}`];
      delete oi[`prop.${propertyId}.detail`];
      if (Object.keys(oi).length !== Object.keys(settings.imageOverrides || {}).length) {
        updateSettings({ imageOverrides: oi });
      }
    } else {
      addProperty({ ...finalProp, id: propertyId });
    }
    void syncNow(buildSnapshot(nextProperties, nextSettings, leads, reviews));
    setIsPropModalOpen(false);
    triggerSaveToast();
  };

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    void syncNow(buildSnapshot(properties, tempSettings, leads, reviews));
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleUpdateOwnershipTier = (index: number, updated: Partial<OwnershipTier>) => {
    const current = [...(tempSettings.ownershipTiers || [])];
    current[index] = { ...current[index], ...updated };
    setTempSettings({ ...tempSettings, ownershipTiers: current });
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      (l.carModel && l.carModel.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.plateNumber && l.plateNumber.toLowerCase().includes(leadSearch.toLowerCase())) ||
      l.propertyInterest.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesFilter = leadFilter === "All" || l.status === leadFilter;
    return matchesSearch && matchesFilter;
  });

  const promoPreview = propForm.promo?.enabled
    ? calculatePromoPrice(propForm.price, propForm.promo)
    : null;

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-2 sm:p-5 text-highlands-900"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-highlands-950/60 backdrop-blur-sm" onClick={closeAdmin} />

      <div
        className="animate-scale-in relative z-10 flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-highlands-900/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-highlands-900/8 bg-cream-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-gold-400/40 bg-gold-50 text-gold-700 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-normal text-highlands-900">
                  Seller's Portal &amp; Specialist Dashboard
                </h1>
                <span className="rounded-full border border-gold-600/30 bg-gold-50 px-2.5 py-0.5 text-[10px] font-bold text-gold-800 uppercase">
                  Jewel Villafranca
                </span>
              </div>
              <p className="text-xs text-pine-600">
                Attach photos via drag &amp; drop, manage multiple angles, 4 communities, ownership terms &amp; gate passes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 rounded-full border border-highlands-900/10 bg-white px-3 py-1.5 text-xs text-pine-700 transition-colors hover:bg-rose-50 hover:text-rose-700 shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            )}
            <button
              type="button"
              onClick={closeAdmin}
              className="grid h-8 w-8 place-items-center rounded-full bg-white text-highlands-900 border border-highlands-900/10 shadow-2xs transition-colors hover:bg-cream-100"
              aria-label="Close portal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Auth Check */}
        {!isAuthenticated ? (
          <div className="flex flex-1 items-center justify-center p-6 bg-cream-50/40">
            <div className="w-full max-w-sm rounded-3xl border border-highlands-900/10 bg-white p-8 text-center shadow-lg">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-gold-400/40 bg-gold-50 text-gold-700 shadow-2xs">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-normal text-highlands-900">
                Specialist Sign-In
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-pine-600">
                Choose the mode you'd like to open. Both are private and exclusive to Jewel.
              </p>

              <form onSubmit={handlePinSubmit} className="mt-5 space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter Security PIN"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    className={cn(
                      "w-full rounded-xl border bg-cream-50/70 px-4 py-3 text-center text-sm font-semibold tracking-widest text-highlands-900 outline-none transition-colors",
                      pinError
                        ? "border-rose-400 focus:border-rose-600 bg-rose-50"
                        : "border-highlands-900/15 focus:border-gold-500 focus:bg-white",
                    )}
                  />
                  {pinError && (
                    <p className="mt-2 text-xs text-rose-600 font-medium">
                      Incorrect PIN. Please check the two access modes below.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 space-y-3 border-t border-highlands-900/8 pt-4 text-left">
                <div className="flex items-start gap-2.5 rounded-xl border border-highlands-900/10 bg-cream-50/60 p-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-800">
                    <CreditCard className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-highlands-900">
                      Seller's Portal — PIN: <span className="text-gold-700">jewel2026</span>
                    </p>
                    <p className="text-[10.5px] text-pine-600 leading-snug">
                      Manage listings, photos, promos, ownership terms &amp; gate pass leads.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-gold-500/30 bg-gold-50/60 p-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold-400 text-highlands-950">
                    <Pencil className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-highlands-900">
                      Live Page Editor — PIN: <span className="text-gold-700">jewel1623</span>
                    </p>
                    <p className="text-[10.5px] text-pine-600 leading-snug">
                      Click ANY word or ANY photo directly on the landing page to change it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[230px_1fr]">
            {/* Sidebar Navigation */}
            <aside className="flex flex-row overflow-x-auto border-r border-highlands-900/8 bg-cream-50/70 p-3 lg:flex-col lg:space-y-1">
              {[
                {
                  id: "leads",
                  label: "Gate Pass Tripping Leads",
                  badge: leads.filter((l) => l.status === "New").length,
                  icon: Users,
                },
                {
                  id: "reviews",
                  label: "Site Tripping Reviews",
                  badge: reviews.filter((r) => r.approved).length,
                  icon: MessageSquare,
                },
                {
                  id: "properties",
                  label: "Properties & Promos",
                  badge: properties.length,
                  icon: Building,
                },
                { id: "communities", label: "4 Communities Photos", icon: Layers },
                { id: "terms", label: "Ownership Terms & Pricing", icon: CreditCard },
                { id: "about", label: "About Jewel Photo & Bio", icon: User },
                { id: "content", label: "Hero Headlines & Copy", icon: SettingsIcon },
                { id: "media", label: "Hero Background Photos", icon: ImageIcon },
                { id: "tripping", label: "Tour Itinerary", icon: Compass },
                { id: "cloud", label: "Cloud Backup & Restore", icon: CloudUpload },
                { id: "security", label: "Security & Reset", icon: Lock },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      "flex shrink-0 items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-300 lg:w-full",
                      active
                        ? "border border-gold-500/40 bg-white text-gold-800 shadow-2xs"
                        : "text-pine-700 hover:bg-white/60 hover:text-highlands-900",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComponent className="h-4 w-4 text-gold-600" />
                      {tab.label}
                    </span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          tab.id === "leads" && tab.badge > 0
                            ? "bg-highlands-600 text-white"
                            : "bg-highlands-900/10 text-highlands-900",
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="hidden pt-6 lg:block">
                <button
                  type="button"
                  onClick={closeAdmin}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-highlands-900/10 bg-white py-2.5 text-xs font-semibold text-highlands-900 transition-colors hover:bg-cream-50 shadow-2xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gold-600" /> View Public Site
                </button>
              </div>
            </aside>

            {/* Content Body */}
            <main className="flex-1 overflow-y-auto p-5 sm:p-8 bg-white">
              {/* TAB 1: SITE TRIPPING LEADS */}
              {activeTab === "leads" && (
                <div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-normal text-highlands-900">
                        Inbound Tripping Bookings &amp; Gate Pass Clearances
                      </h2>
                      <p className="mt-1 text-xs text-pine-600">
                        Review visitor car models and plate numbers to issue gate passes or
                        schedule Highlands van tours from the SMO.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-pine-600/50" />
                        <input
                          type="text"
                          placeholder="Search client / car / plate..."
                          value={leadSearch}
                          onChange={(e) => setLeadSearch(e.target.value)}
                          className="rounded-full border border-highlands-900/15 bg-cream-50/70 py-1.5 pr-4 pl-9 text-xs text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <select
                        value={leadFilter}
                        onChange={(e) => setLeadFilter(e.target.value)}
                        className="rounded-full border border-highlands-900/15 bg-cream-50/70 px-3 py-1.5 text-xs text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                      >
                        <option value="All">All Status</option>
                        <option value="New">New</option>
                        <option value="Gate Pass Issued">Gate Pass Issued</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Tripping Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {filteredLeads.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-highlands-900/10 bg-cream-50/50 p-12 text-center text-pine-600">
                      <Users className="mx-auto h-8 w-8 text-pine-600/40" />
                      <p className="mt-3 text-sm">No site tripping bookings match your filter.</p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {filteredLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="rounded-2xl border border-highlands-900/10 bg-cream-50/40 p-5 transition-colors hover:border-gold-500/40 sm:p-6"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-display text-lg font-normal text-highlands-900">
                                  {lead.name}
                                </h3>
                                <span
                                  className={cn(
                                    "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase",
                                    lead.status === "New"
                                      ? "border-highlands-600/30 bg-highlands-50 text-highlands-800"
                                      : lead.status === "Gate Pass Issued"
                                        ? "border-gold-600/40 bg-gold-50 text-gold-800"
                                        : "border-highlands-900/10 bg-white text-pine-700",
                                  )}
                                >
                                  {lead.status}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-pine-600 font-medium">
                                Booked on {lead.createdAt}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={lead.status}
                                onChange={(e) =>
                                  updateLeadStatus(
                                    lead.id,
                                    e.target.value as SiteTrippingLead["status"],
                                  )
                                }
                                className="rounded-lg border border-highlands-900/15 bg-white px-2.5 py-1 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium shadow-2xs"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Gate Pass Issued">Gate Pass Issued</option>
                                <option value="Tripping Scheduled">Tripping Scheduled</option>
                                <option value="Completed">Completed</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => deleteLead(lead.id)}
                                className="grid h-7 w-7 place-items-center rounded-lg border border-highlands-900/10 bg-white text-pine-600 transition-colors hover:border-rose-400 hover:text-rose-600"
                                title="Delete Lead"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 rounded-xl border border-highlands-900/8 bg-white p-4 text-xs sm:grid-cols-2 lg:grid-cols-4 shadow-2xs">
                            <div>
                              <p className="text-pine-600 uppercase font-semibold">Tour Date &amp; Time</p>
                              <p className="mt-0.5 font-bold text-highlands-900">
                                {lead.preferredDate} · {lead.preferredTime}
                              </p>
                            </div>
                            <div>
                              <p className="text-pine-600 uppercase font-semibold">Gate Pass Vehicle</p>
                              <p className="mt-0.5 font-bold text-highlands-900">
                                {lead.carModel}
                              </p>
                              <p className="text-[11px] text-gold-700 font-mono font-medium">
                                Plate: {lead.plateNumber || "Optional / To follow"}
                              </p>
                            </div>
                            <div>
                              <p className="text-pine-600 uppercase font-semibold">SMO &amp; Highlands Van</p>
                              <p className="mt-0.5 text-highlands-900 font-medium">{lead.guestCount}</p>
                              <p className="text-[11px] text-highlands-700 font-semibold">
                                {lead.useVanAtSMO ? "✓ Use Highlands Van at SMO" : "Own car during tour"}
                              </p>
                            </div>
                            <div>
                              <p className="text-pine-600 uppercase font-semibold">Category &amp; Budget</p>
                              <p className="mt-0.5 font-bold text-highlands-900">{lead.propertyInterest}</p>
                              <p className="text-[11px] text-gold-700 font-medium">{lead.budgetRange}</p>
                            </div>
                          </div>

                          {lead.notes && (
                            <p className="mt-3 text-xs text-pine-700 italic">
                              "{lead.notes}"
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-highlands-900/8">
                            <a
                              href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-highlands-900/15 bg-white px-3 py-1.5 text-xs text-highlands-900 shadow-2xs transition-colors hover:bg-cream-50"
                            >
                              <Phone className="h-3 w-3 text-gold-600" /> Call {lead.name}
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(lead.name)},%20this%20is%20Jewel%20from%20Tagaytay%20Highlands.%20I%20have%20received%20your%20site%20tripping%20details%20for%20${encodeURIComponent(lead.preferredDate)}%20and%20I'm%20processing%20your%20Gate%202%20pass.`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-highlands-600/30 bg-highlands-50 px-3 py-1.5 text-xs text-highlands-800 shadow-2xs transition-colors hover:bg-highlands-100"
                            >
                              <MessageSquare className="h-3 w-3" /> Send Gate Pass Clearance via WhatsApp
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SITE TRIPPING REVIEWS */}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-normal text-highlands-900">
                        Site Tripping Reviews
                      </h2>
                      <p className="mt-1 text-xs text-pine-600">
                        Reviews submitted by clients after site tripping. You can hide or delete any
                        comment anytime.
                      </p>
                    </div>
                    <div className="rounded-full border border-highlands-900/10 bg-cream-50 px-4 py-2 text-xs font-semibold text-highlands-900">
                      {reviews.filter((r) => r.approved).length} public / {reviews.length} total
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl border border-highlands-900/10 bg-cream-50/50 p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-lg text-highlands-900">{r.name}</h3>
                              <span className="rounded-full border border-gold-400/40 bg-gold-50 px-2.5 py-0.5 text-[10px] font-bold text-gold-800">
                                {"★".repeat(Math.max(1, Math.min(5, r.rating)))}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                                  r.approved
                                    ? "bg-highlands-50 text-highlands-800 border border-highlands-600/30"
                                    : "bg-rose-50 text-rose-700 border border-rose-200",
                                )}
                              >
                                {r.approved ? "Visible" : "Hidden"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-pine-600">
                              {r.location || "No location"} · {r.createdAt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleReviewApproval(r.id)}
                              className="rounded-lg border border-highlands-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-highlands-900 hover:bg-cream-50"
                            >
                              {r.approved ? "Hide" : "Show"}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteReview(r.id)}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                              aria-label="Delete review"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-4 rounded-xl border border-highlands-900/8 bg-white p-4 text-sm leading-relaxed text-pine-700">
                          "{r.quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PROPERTIES & PROMOS */}
              {activeTab === "properties" && (
                <div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-normal text-highlands-900">
                        Available Properties Catalog
                      </h2>
                      <p className="mt-1 text-xs text-pine-600">
                        Attach multiple photo angles per property via drag &amp; drop, set % stackable promos (e.g. 30% + 10%) &amp; countdown timers.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddProp}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-5 py-2.5 text-xs font-semibold text-highlands-950 shadow-xs transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Plus className="h-4 w-4" /> Add New Listing
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {properties.map((prop) => {
                      const pPromo = calculatePromoPrice(prop.price, prop.promo);
                      const images = prop.images && prop.images.length > 0 ? prop.images : [prop.image];
                      return (
                        <div
                          key={prop.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-highlands-900/10 bg-white transition-all hover:border-gold-500/40 hover:shadow-md"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={images[0] || prop.image}
                              alt={prop.name}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-highlands-950/80 via-transparent to-transparent" />

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 flex-wrap">
                              {pPromo.isPromoActive ? (
                                <span className="flex items-center gap-1 rounded-full border border-amber-300 bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase shadow-2xs">
                                  <Flame className="h-3 w-3 text-amber-500" />
                                  <span>{pPromo.promoBadgeText}</span>
                                </span>
                              ) : (
                                <span className="rounded-full border border-white/20 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-highlands-900 uppercase">
                                  {prop.status}
                                </span>
                              )}

                              <div className="flex items-center gap-1">
                                {images.length > 1 && (
                                  <span className="rounded-full border border-white/20 bg-highlands-950/70 px-2 py-0.5 text-[10px] text-white flex items-center gap-1">
                                    <Images className="h-2.5 w-2.5 text-gold-300" />
                                    {images.length} photos
                                  </span>
                                )}
                                <span className="rounded-full border border-white/20 bg-white/90 px-2.5 py-0.5 text-[10px] text-highlands-900 font-bold uppercase">
                                  {prop.category}
                                </span>
                              </div>
                            </div>

                            {pPromo.isPromoActive && (
                              <div className="absolute bottom-2 left-3 right-3 rounded-lg bg-white/95 border border-amber-300 px-2 py-1 flex items-center justify-between text-[10.5px]">
                                <span className="text-amber-800 font-bold flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-amber-600" /> Ends in:
                                </span>
                                <span className="font-mono text-highlands-900 font-bold">
                                  {pPromo.timeLeft.formatted}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col p-4">
                            <p className="text-[10px] font-bold tracking-wider text-gold-700 uppercase">
                              {prop.village}
                            </p>
                            <h3 className="mt-1 font-display text-base font-medium text-highlands-900">
                              {prop.name}
                            </h3>

                            <div className="mt-3 border-t border-highlands-900/8 pt-3">
                              {pPromo.isPromoActive ? (
                                <div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-pine-600 line-through">
                                      Regular: {pPromo.originalPriceStr}
                                    </span>
                                    <span className="text-rose-700 font-bold">
                                      Save {pPromo.totalPercentage}%
                                    </span>
                                  </div>
                                  <div className="flex items-baseline justify-between mt-0.5">
                                    <span className="font-display text-lg text-highlands-900 font-bold">
                                      {pPromo.discountedPriceStr}
                                    </span>
                                    <span className="text-xs text-amber-700 font-semibold">
                                      Limited Promo
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-baseline justify-between">
                                  <span className="font-display text-lg text-highlands-900 font-bold">
                                    {prop.price}
                                  </span>
                                  <span className="text-xs text-pine-600 font-medium">{prop.monthly}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex items-center justify-end gap-2 border-t border-highlands-900/8 pt-3">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProp(prop)}
                                className="inline-flex items-center gap-1 rounded-lg border border-highlands-900/10 bg-cream-50 px-3 py-1.5 text-xs text-highlands-900 font-medium transition-colors hover:bg-cream-100"
                              >
                                <Edit2 className="h-3 w-3 text-gold-600" /> Edit Photos &amp; Promos
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProperty(prop.id)}
                                className="grid h-7 w-7 place-items-center rounded-lg border border-highlands-900/10 bg-white text-pine-600 transition-colors hover:border-rose-400 hover:text-rose-600"
                                title="Delete listing"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: 4 COMMUNITIES PHOTOS MANAGER */}
              {activeTab === "communities" && (
                <div>
                  <h2 className="font-display text-2xl font-normal text-highlands-900">
                    4 Masterplanned Communities Cover Photos
                  </h2>
                  <p className="mt-1 text-xs text-pine-600">
                    Attach or drag new cover photos for each of the four main districts. Changes update the public landing page instantly.
                  </p>

                  <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
                    {[
                      {
                        key: "highlands",
                        editorKey: "highlands",
                        label: "The Highlands Cover Photo",
                        subtitle: "approx. 360 hectares · 2000 - 2500 ft ASL",
                        field: "highlands" as keyof typeof tempSettings.communityPhotos,
                      },
                      {
                        key: "midlands",
                        editorKey: "midlands",
                        label: "The Midlands Cover Photo",
                        subtitle: "approx. 671 hectares · 1000 – 1500 ft ASL",
                        field: "midlands" as keyof typeof tempSettings.communityPhotos,
                      },
                      {
                        key: "midlandsWest",
                        editorKey: "midlands-west",
                        label: "Midlands West Cover Photo",
                        subtitle: "approx. 671 hectares · 1000 – 1500 ft ASL",
                        field: "midlandsWest" as keyof typeof tempSettings.communityPhotos,
                      },
                      {
                        key: "greenlands",
                        editorKey: "greenlands",
                        label: "The Greenlands Cover Photo",
                        subtitle: "approx. 260 hectares · 400 – 920 ft ASL",
                        field: "greenlands" as keyof typeof tempSettings.communityPhotos,
                      },
                    ].map((dist) => (
                      <div
                        key={dist.key}
                        className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5"
                      >
                        <FileDropzone
                          label={dist.label}
                          subtitle={dist.subtitle}
                          currentImage={
                            tempSettings.imageOverrides?.[`dist.${dist.editorKey}.cover`] ||
                            tempSettings.communityPhotos?.[dist.field]
                          }
                          onImageSelected={(dataUrl) =>
                            setTempSettings({
                              ...tempSettings,
                              communityPhotos: {
                                ...tempSettings.communityPhotos,
                                [dist.field]: dataUrl,
                              },
                              imageOverrides: {
                                ...(tempSettings.imageOverrides || {}),
                                [`dist.${dist.editorKey}.cover`]: dataUrl,
                              },
                            })
                          }
                        />
                      </div>
                    ))}

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4" /> Save Communities Photos
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: OWNERSHIP TERMS & PRICING */}
              {activeTab === "terms" && (
                <div>
                  <h2 className="font-display text-2xl font-normal text-highlands-900">
                    Ownership Terms &amp; Payment Plans
                  </h2>
                  <p className="mt-1 text-xs text-pine-600">
                    Edit the 3 ownership tiers shown on the landing page (Spot Cash, 0% Interest, Bank Financing).
                  </p>

                  <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
                    {tempSettings.ownershipTiers?.map((tier, idx) => (
                      <div
                        key={tier.id}
                        className={cn(
                          "rounded-2xl border p-5 space-y-4",
                          tier.featured
                            ? "border-gold-500 bg-gold-50/60 shadow-xs"
                            : "border-highlands-900/10 bg-cream-50/40",
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gold-700" />
                            <span className="font-display text-base font-medium text-highlands-900">
                              Tier #{idx + 1}: {tier.name}
                            </span>
                          </div>

                          <label className="flex items-center gap-2 text-xs text-pine-700 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tier.featured}
                              onChange={(e) =>
                                handleUpdateOwnershipTier(idx, { featured: e.target.checked })
                              }
                              className="rounded border-highlands-900/20 text-gold-600"
                            />
                            <span>Highlight as Featured / Most Popular</span>
                          </label>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <label className="text-[11px] font-bold text-highlands-900 uppercase">
                              Plan Name
                            </label>
                            <input
                              type="text"
                              value={tier.name}
                              onChange={(e) =>
                                handleUpdateOwnershipTier(idx, { name: e.target.value })
                              }
                              className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-highlands-900 uppercase">
                              Tag Badge (e.g. Max Savings)
                            </label>
                            <input
                              type="text"
                              value={tier.tag}
                              onChange={(e) =>
                                handleUpdateOwnershipTier(idx, { tag: e.target.value })
                              }
                              className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-highlands-900 uppercase">
                              Headline Price / Term
                            </label>
                            <input
                              type="text"
                              value={tier.price}
                              onChange={(e) =>
                                handleUpdateOwnershipTier(idx, { price: e.target.value })
                              }
                              className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <label className="text-[11px] font-bold text-highlands-900 uppercase">
                              Subtext / Unit Note
                            </label>
                            <input
                              type="text"
                              value={tier.unit}
                              onChange={(e) =>
                                handleUpdateOwnershipTier(idx, { unit: e.target.value })
                              }
                              className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-highlands-900 uppercase">
                              Button CTA Text
                            </label>
                            <input
                              type="text"
                              value={tier.cta}
                              onChange={(e) =>
                                handleUpdateOwnershipTier(idx, { cta: e.target.value })
                              }
                              className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-highlands-900 uppercase">
                              Button Function
                            </label>
                            <select
                              value={tier.action || "tripping"}
                              onChange={(e) =>
                                handleUpdateOwnershipTier(idx, {
                                  action: e.target.value as OwnershipTier["action"],
                                })
                              }
                              className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                            >
                              <option value="spotCash">WhatsApp: Spot Cash Terms</option>
                              <option value="zeroComputation">WhatsApp: 0% Computation</option>
                              <option value="bankComputation">WhatsApp: Bank Computation</option>
                              <option value="tripping">Open Site Tripping Form</option>
                              <option value="inquire">Scroll to Inquiry Form</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-highlands-900 uppercase">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={tier.copy}
                            onChange={(e) =>
                              handleUpdateOwnershipTier(idx, { copy: e.target.value })
                            }
                            className="mt-1 w-full resize-none rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4" /> Save Ownership Terms
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: ABOUT JEWEL PHOTO & BIO */}
              {activeTab === "about" && (
                <div>
                  <h2 className="font-display text-2xl font-normal text-highlands-900">
                    About Jewel — Portrait Photo &amp; Story
                  </h2>
                  <p className="mt-1 text-xs text-pine-600">
                    Attach or drag a new picture of Jewel to update the landing page immediately.
                  </p>

                  <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
                    <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-6">
                      <FileDropzone
                        label="Jewel's Profile Picture (Drag or Attach Image)"
                        subtitle="Upload your photo from your phone or computer to replace the current picture"
                        currentImage={
                          tempSettings.imageOverrides?.["jewel.photo"] || tempSettings.specialistPhoto
                        }
                        onImageSelected={(dataUrl) =>
                          setTempSettings({
                            ...tempSettings,
                            specialistPhoto: dataUrl,
                            imageOverrides: {
                              ...(tempSettings.imageOverrides || {}),
                              "jewel.photo": dataUrl,
                            },
                          })
                        }
                      />

                      <div className="mt-3">
                        <p className="text-[11px] text-pine-600 font-medium">Or pick from sample presets:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {JEWEL_PHOTO_PRESETS.map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() =>
                                setTempSettings({ ...tempSettings, specialistPhoto: p.url })
                              }
                              className="rounded-lg border border-highlands-900/10 bg-white px-2.5 py-1 text-[11px] text-highlands-900 font-medium hover:bg-cream-100"
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-6 space-y-4">
                      <h3 className="font-display text-lg font-normal text-highlands-900">
                        Jewel's Story &amp; Credentials
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold text-highlands-900 uppercase">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={tempSettings.specialistName}
                            onChange={(e) =>
                              setTempSettings({ ...tempSettings, specialistName: e.target.value })
                            }
                            className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-highlands-900 uppercase">
                            Display Role
                          </label>
                          <input
                            type="text"
                            value={tempSettings.specialistRole}
                            onChange={(e) =>
                              setTempSettings({ ...tempSettings, specialistRole: e.target.value })
                            }
                            className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-highlands-900 uppercase">
                          Personal Quote
                        </label>
                        <input
                          type="text"
                          value={tempSettings.specialistQuote}
                          onChange={(e) =>
                            setTempSettings({ ...tempSettings, specialistQuote: e.target.value })
                          }
                          className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-highlands-900 uppercase">
                          Jewel's Story &amp; Approach
                        </label>
                        <textarea
                          rows={3}
                          value={tempSettings.specialistStory}
                          onChange={(e) =>
                            setTempSettings({ ...tempSettings, specialistStory: e.target.value })
                          }
                          className="mt-1.5 w-full resize-none rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4" /> Save About Jewel Changes
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 6: COPY & HEADLINES */}
              {activeTab === "content" && (
                <div>
                  <h2 className="font-display text-2xl font-normal text-highlands-900">
                    Hero Section Headlines &amp; Contacts
                  </h2>

                  <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
                    <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-6 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold text-highlands-900 uppercase">
                            Headline Prefix
                          </label>
                          <input
                            type="text"
                            value={tempSettings.heroHeadlinePrefix}
                            onChange={(e) =>
                              setTempSettings({
                                ...tempSettings,
                                heroHeadlinePrefix: e.target.value,
                              })
                            }
                            className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-highlands-900 uppercase">
                            Headline Accent
                          </label>
                          <input
                            type="text"
                            value={tempSettings.heroHeadlineAccent}
                            onChange={(e) =>
                              setTempSettings({
                                ...tempSettings,
                                heroHeadlineAccent: e.target.value,
                              })
                            }
                            className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium text-gold-700"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-xs font-bold text-highlands-900 uppercase">
                            Mobile Phone
                          </label>
                          <input
                            type="text"
                            value={tempSettings.phone}
                            onChange={(e) =>
                              setTempSettings({ ...tempSettings, phone: e.target.value })
                            }
                            className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-highlands-900 uppercase">
                            WhatsApp
                          </label>
                          <input
                            type="text"
                            value={tempSettings.whatsapp}
                            onChange={(e) =>
                              setTempSettings({ ...tempSettings, whatsapp: e.target.value })
                            }
                            className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-highlands-900 uppercase">
                            Email
                          </label>
                          <input
                            type="email"
                            value={tempSettings.email}
                            onChange={(e) =>
                              setTempSettings({ ...tempSettings, email: e.target.value })
                            }
                            className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4" /> Save Content Changes
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: HERO BACKGROUND & VILLA PHOTOS */}
              {activeTab === "media" && (
                <div>
                  <h2 className="font-display text-2xl font-normal text-highlands-900">
                    Complete Website Photo Library
                  </h2>
                  <p className="mt-1 text-xs text-pine-600">
                    Every photo on the landing page can be replaced here by drag &amp; drop — or use the
                    Live Page Editor (PIN <strong className="text-gold-700">jewel1623</strong>) to click any
                    photo directly on the page.
                  </p>

                  <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                        <FileDropzone
                          label="Hero Parallax Background"
                          subtitle="Main hero background photo"
                          currentImage={
                            tempSettings.imageOverrides?.["hero.main"] || tempSettings.heroImage
                          }
                          onImageSelected={(dataUrl) =>
                            setTempSettings({
                              ...tempSettings,
                              heroImage: dataUrl,
                              imageOverrides: {
                                ...(tempSettings.imageOverrides || {}),
                                "hero.main": dataUrl,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                        <FileDropzone
                          label="Hero Featured Villa Photo"
                          subtitle="Showcase photo in the hero card"
                          currentImage={
                            tempSettings.imageOverrides?.["hero.card"] || tempSettings.heroCardImage
                          }
                          onImageSelected={(dataUrl) =>
                            setTempSettings({
                              ...tempSettings,
                              heroCardImage: dataUrl,
                              imageOverrides: {
                                ...(tempSettings.imageOverrides || {}),
                                "hero.card": dataUrl,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                        <FileDropzone
                          label="Investment Section Photo"
                          subtitle="Fairway image in the Benefits section"
                          currentImage={tempSettings.imageOverrides?.["benefits"] || "https://images.pexels.com/photos/32988401/pexels-photo-32988401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000"}
                          onImageSelected={(dataUrl) =>
                            setTempSettings({
                              ...tempSettings,
                              imageOverrides: { ...(tempSettings.imageOverrides || {}), benefits: dataUrl },
                            })
                          }
                        />
                      </div>

                      <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                        <FileDropzone
                          label="Tagaytay Highlands Digital Map"
                          subtitle="Upload the official estate digital map image"
                          currentImage={
                            tempSettings.imageOverrides?.["digital.map"] ||
                            "/images/tagaytay-highlands-digital-map.jpg"
                          }
                          onImageSelected={(dataUrl) =>
                            setTempSettings({
                              ...tempSettings,
                              imageOverrides: {
                                ...(tempSettings.imageOverrides || {}),
                                "digital.map": dataUrl,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                        <p className="text-xs font-bold text-highlands-900 uppercase tracking-wider mb-2">
                          Site Tripping Tour Gallery ({3} photos)
                        </p>
                        {["tour.0", "tour.1", "tour.2"].map((key, idx) => (
                          <div key={key} className="mb-3">
                            <FileDropzone
                              label={`Tour Photo ${idx + 1}`}
                              subtitle={`Gallery highlight #${idx + 1}`}
                              currentImage={tempSettings.imageOverrides?.[key]}
                              onImageSelected={(dataUrl) =>
                                setTempSettings({
                                  ...tempSettings,
                                  imageOverrides: { ...(tempSettings.imageOverrides || {}), [key]: dataUrl },
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                      <p className="text-xs font-bold text-highlands-900 uppercase tracking-wider mb-2">
                        4 Exclusive Clubs Photos
                      </p>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {["club.0", "club.1", "club.2", "club.3"].map((key, idx) => (
                          <FileDropzone
                            key={key}
                            label={`Club Photo ${idx + 1}`}
                            subtitle={`Club #${idx + 1} showcase`}
                            currentImage={tempSettings.imageOverrides?.[key]}
                            onImageSelected={(dataUrl) =>
                              setTempSettings({
                                ...tempSettings,
                                imageOverrides: { ...(tempSettings.imageOverrides || {}), [key]: dataUrl },
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                      <p className="text-xs font-bold text-highlands-900 uppercase tracking-wider mb-2">
                        Gourmet Restaurants Photos ({OFFICIAL_RESTAURANTS.length})
                      </p>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {OFFICIAL_RESTAURANTS.map((rest, idx) => (
                          <FileDropzone
                            key={`rest.${idx}`}
                            label={rest.name}
                            subtitle={`Dining photo — ${rest.location}`}
                            currentImage={tempSettings.imageOverrides?.[`rest.${idx}`] || rest.image}
                            onImageSelected={(dataUrl) =>
                              setTempSettings({
                                ...tempSettings,
                                imageOverrides: {
                                  ...(tempSettings.imageOverrides || {}),
                                  [`rest.${idx}`]: dataUrl,
                                },
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                      <p className="text-xs font-bold text-highlands-900 uppercase tracking-wider mb-2">
                        Places to Go Photos ({PLACES_TO_GO.length})
                      </p>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {PLACES_TO_GO.map((place, idx) => (
                          <FileDropzone
                            key={`place.${idx}`}
                            label={place.name}
                            subtitle={place.desc}
                            currentImage={tempSettings.imageOverrides?.[`place.${idx}`] || place.image}
                            onImageSelected={(dataUrl) =>
                              setTempSettings({
                                ...tempSettings,
                                imageOverrides: {
                                  ...(tempSettings.imageOverrides || {}),
                                  [`place.${idx}`]: dataUrl,
                                },
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4" /> Save All Website Photos
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 8: TOUR ITINERARY */}
              {activeTab === "tripping" && (
                <div>
                  <h2 className="font-display text-2xl font-normal text-highlands-900">
                    VIP Site Tripping &amp; Gate Pass Itinerary
                  </h2>

                  <div className="mt-6 space-y-4">
                    {tempSettings.trippingItinerary.map((item, idx) => (
                      <div
                        key={item.step}
                        className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold text-gold-700">
                            Step {item.step}
                          </span>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => {
                              const updated = [...tempSettings.trippingItinerary];
                              updated[idx].duration = e.target.value;
                              setTempSettings({ ...tempSettings, trippingItinerary: updated });
                            }}
                            className="w-28 rounded-lg border border-highlands-900/15 bg-white px-2.5 py-1 text-xs text-highlands-900 text-right focus:border-gold-500 focus:outline-none font-medium"
                            placeholder="Duration"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...tempSettings.trippingItinerary];
                            updated[idx].title = e.target.value;
                            setTempSettings({ ...tempSettings, trippingItinerary: updated });
                          }}
                          className="mt-3 w-full rounded-xl border border-highlands-900/15 bg-white px-3.5 py-2 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                        />
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => {
                            const updated = [...tempSettings.trippingItinerary];
                            updated[idx].desc = e.target.value;
                            setTempSettings({ ...tempSettings, trippingItinerary: updated });
                          }}
                          className="mt-2 w-full resize-none rounded-xl border border-highlands-900/15 bg-white px-3.5 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        updateSettings(tempSettings);
                        void syncNow(buildSnapshot(properties, tempSettings, leads, reviews));
                        triggerSaveToast();
                      }}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-7 py-3 text-sm font-semibold text-highlands-950 shadow-md transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4" /> Save Itinerary
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 9: CLOUD BACKUP & RESTORE */}
              {activeTab === "cloud" && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-normal text-highlands-900">
                      Cloud Backup &amp; Restore
                    </h2>
                    <p className="mt-1 text-xs text-pine-600">
                      Your edits are saved permanently on this device. Turn on cloud sync so your
                      content is also backed up online and can be restored on any device — plus
                      download/restore a full backup file anytime.
                    </p>
                  </div>

                  {/* Sync status card */}
                  <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {syncState === "syncing" ? (
                          <RefreshCw className="h-4 w-4 text-gold-700 animate-spin" />
                        ) : syncState === "error" ? (
                          <AlertCircle className="h-4 w-4 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-highlands-600" />
                        )}
                        <span className="text-sm font-bold text-highlands-900">
                          {syncState === "syncing"
                            ? "Syncing to Supabase..."
                            : syncState === "error"
                              ? "Last sync failed"
                              : "Auto sync is ON"}
                        </span>
                      </div>
                      {lastSyncedAt && (
                        <span className="text-[11px] text-pine-600 font-medium">
                          Last synced: {new Date(lastSyncedAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={exportBackup}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-highlands-900/15 bg-white px-5 py-2.5 text-xs font-semibold text-highlands-900 shadow-2xs transition-colors hover:bg-cream-50"
                      >
                        <Download className="h-4 w-4 text-gold-600" /> Download Backup File
                      </button>
                      <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-highlands-900/15 bg-white px-5 py-2.5 text-xs font-semibold text-highlands-900 shadow-2xs transition-colors hover:bg-cream-50">
                        <UploadCloud className="h-4 w-4 text-highlands-600" /> Restore from File
                        <input
                          type="file"
                          accept="application/json,.json"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const res = await importBackup(file);
                            alert(res.message);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-gold-700" />
                      <h3 className="text-sm font-bold text-highlands-900">Supabase shared sync</h3>
                    </div>

                    <p className="text-[11.5px] leading-relaxed text-pine-600">
                      This portal now saves shared content to a Supabase table instead of the old bin-based sync.
                      When you change listings, leads, reviews, or content here, other devices will
                      pick it up automatically on the next sync poll.
                    </p>

                    <p className="text-[11px] text-pine-600 leading-relaxed">
                      💡 <strong className="text-highlands-900">Note:</strong> if you store large
                      embedded photos as base64 data, Supabase can still fill up faster than plain
                      text. Best practice is to keep photo URLs or move uploads to Supabase Storage.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 10: SECURITY & RESET */}
              {activeTab === "security" && (
                <div className="max-w-xl space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-normal text-highlands-900">
                      Security &amp; Portal PIN
                    </h2>
                    <p className="mt-1 text-xs text-pine-600">
                      Update the PIN code used to unlock this seller's portal.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/60 p-6">
                    <label className="text-xs font-bold text-highlands-900 uppercase">
                      New Security PIN
                    </label>
                    <input
                      type="text"
                      value={tempSettings.adminPin}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, adminPin: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-3 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({ adminPin: tempSettings.adminPin });
                        triggerSaveToast();
                      }}
                      className="mt-4 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-6 py-2.5 text-xs font-semibold text-highlands-950 shadow-md"
                    >
                      Update PIN Code
                    </button>
                  </div>

                  <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6">
                    <div className="flex items-center gap-2 text-rose-700">
                      <AlertCircle className="h-5 w-5" />
                      <h3 className="font-display text-base font-semibold">Reset to Factory Defaults</h3>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-rose-900">
                      This will reset all properties, photos, copy, and demo site tripping leads to
                      the original preset data.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to reset all website data to initial defaults?",
                          )
                        ) {
                          resetAllToDefault();
                          setTempSettings(settings);
                          triggerSaveToast();
                        }
                      }}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset All Data
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}

        {/* Floating Save Notification */}
        {saveToast && (
          <div className="absolute right-6 bottom-6 flex items-center gap-2 rounded-2xl border border-highlands-600 bg-highlands-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl">
            <Check className="h-4 w-4 text-gold-300" /> Changes saved and live on your website!
          </div>
        )}
      </div>

      {/* ADD / EDIT PROPERTY MODAL */}
      {isPropModalOpen && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-highlands-950/60 backdrop-blur-sm"
            onClick={() => setIsPropModalOpen(false)}
          />
          <div
            className="animate-scale-in relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-highlands-900/10 bg-white p-6 shadow-2xl sm:p-8 text-highlands-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-highlands-900/8 pb-4">
              <h2 className="font-display text-xl font-normal text-highlands-900">
                {editingProp ? "Edit Property Listing & Multi-Photos" : "Add New Property Listing & Multi-Photos"}
              </h2>
              <button
                type="button"
                onClick={() => setIsPropModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-cream-50 text-highlands-900 hover:bg-cream-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProp} className="mt-6 space-y-5">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.name}
                    onChange={(e) => setPropForm({ ...propForm, name: e.target.value })}
                    placeholder="e.g. Primrose Parks / Highlands Residences"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">
                    District / Village Enclave *
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.village}
                    onChange={(e) => setPropForm({ ...propForm, village: e.target.value })}
                    placeholder="e.g. The Midlands / The Highlands / Midlands West / The Greenlands"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-bold text-gold-700 uppercase">
                    Category *
                  </label>
                  <select
                    value={propForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value as PropertyCategory;
                      setPropForm({
                        ...propForm,
                        category: newCat,
                        beds:
                          newCat === "Lot"
                            ? "Custom Build Lot"
                            : newCat === "Condo"
                              ? "2 Bedrooms"
                              : "3 Bedrooms",
                        baths: newCat === "Lot" ? "" : "2 Bathrooms",
                      });
                    }}
                    className="mt-1.5 w-full rounded-xl border border-gold-400 bg-white px-3 py-2.5 text-sm text-highlands-900 focus:border-gold-600 focus:outline-none font-semibold"
                  >
                    <option value="Lot">Lot</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Status</label>
                  <select
                    value={propForm.status}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        status: e.target.value as Property["status"],
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="Available">Available</option>
                    <option value="Few Left">Few Left</option>
                    <option value="Pre-Selling">Pre-Selling</option>
                    <option value="Hot Deal">Hot Deal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">
                    Elevation
                  </label>
                  <input
                    type="text"
                    value={propForm.elevation}
                    onChange={(e) => setPropForm({ ...propForm, elevation: e.target.value })}
                    placeholder="2,300 ft ASL"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Dynamic Specs */}
              {propForm.category === "Lot" ? (
                <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4">
                  <div>
                    <label className="text-xs font-bold text-highlands-900 uppercase">
                      Lot Cut Area (sqm) *
                    </label>
                    <input
                      type="text"
                      required
                      value={propForm.lotArea || propForm.area}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          lotArea: e.target.value,
                          area: e.target.value,
                        })
                      }
                      placeholder="e.g. 450–700 sqm"
                      className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-highlands-900 uppercase">
                      Lot Orientation / Topography
                    </label>
                    <input
                      type="text"
                      value={propForm.beds}
                      onChange={(e) => setPropForm({ ...propForm, beds: e.target.value })}
                      placeholder="e.g. Mountain View / Gentle Slope"
                      className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-white px-4 py-2 text-sm text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gold-500/30 bg-gold-50/60 p-4 space-y-3">
                  <p className="text-[11px] font-bold tracking-wider text-gold-800 uppercase">
                    {propForm.category} Unit Specifications
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] text-highlands-900 font-bold uppercase">Bedrooms</label>
                      <select
                        value={propForm.beds}
                        onChange={(e) => setPropForm({ ...propForm, beds: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                      >
                        <option value="Studio">Studio</option>
                        <option value="1 Bedroom">1 Bedroom</option>
                        <option value="2 Bedrooms">2 Bedrooms</option>
                        <option value="3 Bedrooms">3 Bedrooms</option>
                        <option value="4 Bedrooms">4 Bedrooms</option>
                        <option value="5+ Bedrooms">5+ Bedrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-highlands-900 font-bold uppercase">Bathrooms</label>
                      <select
                        value={propForm.baths || "2 Bathrooms"}
                        onChange={(e) => setPropForm({ ...propForm, baths: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                      >
                        <option value="1 Bathroom">1 Bathroom</option>
                        <option value="1.5 Bathrooms">1.5 Bathrooms</option>
                        <option value="2 Bathrooms">2 Bathrooms</option>
                        <option value="3 Bathrooms">3 Bathrooms</option>
                        <option value="4 Bathrooms">4 Bathrooms</option>
                        <option value="5+ Bathrooms">5+ Bathrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-highlands-900 font-bold uppercase">Floor Area</label>
                      <input
                        type="text"
                        value={propForm.floorArea || propForm.area}
                        onChange={(e) =>
                          setPropForm({
                            ...propForm,
                            floorArea: e.target.value,
                            area: e.target.value,
                          })
                        }
                        placeholder="e.g. 110 sqm"
                        className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] text-highlands-900 font-bold uppercase">Parking</label>
                      <input
                        type="text"
                        value={propForm.parking || ""}
                        onChange={(e) => setPropForm({ ...propForm, parking: e.target.value })}
                        placeholder="e.g. 1 Dedicated Slot / 2 Car Garage"
                        className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-highlands-900 font-bold uppercase">Furnishing</label>
                      <input
                        type="text"
                        value={propForm.furnishing || ""}
                        onChange={(e) => setPropForm({ ...propForm, furnishing: e.target.value })}
                        placeholder="e.g. Fully Furnished / Fitted Turnover"
                        className="mt-1 w-full rounded-xl border border-highlands-900/15 bg-white px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Monthly */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">
                    Standard Base Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.price}
                    onChange={(e) => setPropForm({ ...propForm, price: e.target.value })}
                    placeholder="₱14.2M"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">
                    Monthly Amortization (0% Interest)
                  </label>
                  <input
                    type="text"
                    value={propForm.monthly}
                    onChange={(e) => setPropForm({ ...propForm, monthly: e.target.value })}
                    placeholder="₱71,500 / mo"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* PROMO MANAGER */}
              <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">
                        Limited-Time Promo &amp; Countdown Timer
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        Add stackable % promos (e.g. 30% + 10%), badge &amp; live expiration counter
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={propForm.promo?.enabled || false}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          promo: {
                            ...(propForm.promo || getDefaultPromo(7)),
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-gold-600"></div>
                  </label>
                </div>

                {propForm.promo?.enabled && (
                  <div className="space-y-4 pt-3 border-t border-amber-200">
                    <div>
                      <label className="text-xs font-bold text-amber-900 uppercase">
                        Promo Campaign Name
                      </label>
                      <input
                        type="text"
                        value={propForm.promo.title || ""}
                        onChange={(e) =>
                          setPropForm({
                            ...propForm,
                            promo: { ...propForm.promo!, title: e.target.value },
                          })
                        }
                        placeholder="e.g. Midlands Summer Launch Special / Spot Cash VIP Promo"
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-amber-900 uppercase">
                          Stackable Promo Discounts ({propForm.promo.discounts.reduce((a, b) => a + (b.percentage || 0), 0)}% Total Savings)
                        </label>
                        <button
                          type="button"
                          onClick={handleAddDiscount}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950"
                        >
                          <Plus className="h-3 w-3" /> Add Another Promo (% + %)
                        </button>
                      </div>

                      <div className="mt-2 space-y-2">
                        {propForm.promo.discounts.map((disc, idx) => (
                          <div
                            key={disc.id}
                            className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white p-2.5 shadow-2xs"
                          >
                            <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-100 text-[10px] font-bold text-amber-900">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={disc.label}
                              onChange={(e) =>
                                handleUpdateDiscount(disc.id, { label: e.target.value })
                              }
                              placeholder="Discount Label (e.g. 30% Launch Discount)"
                              className="flex-1 rounded-lg border border-amber-100 bg-cream-50/50 px-2.5 py-1.5 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none"
                            />
                            <div className="flex items-center gap-1 w-28">
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={disc.percentage || 0}
                                onChange={(e) =>
                                  handleUpdateDiscount(disc.id, {
                                    percentage: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-16 rounded-lg border border-amber-100 bg-cream-50/50 px-2 py-1.5 text-xs font-bold text-amber-900 text-center focus:border-gold-500 focus:outline-none"
                              />
                              <span className="text-xs text-amber-900 font-bold">% OFF</span>
                            </div>

                            {propForm.promo!.discounts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveDiscount(disc.id)}
                                className="p-1 text-pine-600 hover:text-rose-600"
                                title="Remove discount"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-amber-900 uppercase">
                          Promo Expiration Date &amp; Time
                        </label>
                        <div className="flex gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPromoDaysPreset(3)}
                            className="rounded bg-white border border-amber-200 px-2 py-0.5 text-amber-900 font-semibold hover:bg-amber-100"
                          >
                            +3 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => setPromoDaysPreset(7)}
                            className="rounded bg-white border border-amber-200 px-2 py-0.5 text-amber-900 font-semibold hover:bg-amber-100"
                          >
                            +7 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => setPromoDaysPreset(14)}
                            className="rounded bg-white border border-amber-200 px-2 py-0.5 text-amber-900 font-semibold hover:bg-amber-100"
                          >
                            +14 Days
                          </button>
                        </div>
                      </div>

                      <div className="mt-1">
                        <input
                          type="datetime-local"
                          required={propForm.promo.enabled}
                          value={propForm.promo.endsAt || ""}
                          onChange={(e) =>
                            setPropForm({
                              ...propForm,
                              promo: { ...propForm.promo!, endsAt: e.target.value },
                            })
                          }
                          className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {promoPreview && (
                      <div className="rounded-xl border border-amber-300 bg-white p-3.5 space-y-2 text-xs shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-900 font-bold flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-amber-600" />
                            {promoPreview.promoBadgeText}
                          </span>
                          <span className="font-mono text-highlands-900 font-bold">
                            ⏳ {promoPreview.timeLeft.formatted}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-amber-100 pt-2">
                          <span className="text-pine-600 line-through">
                            Original: {promoPreview.originalPriceStr}
                          </span>
                          <span className="font-display text-base font-bold text-highlands-900">
                            Discounted Price: {promoPreview.discountedPriceStr}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MULTI-PHOTO DRAG & DROP ATTACHMENT */}
              <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Images className="h-4 w-4 text-gold-700" />
                    <div>
                      <h4 className="text-xs font-bold text-highlands-900 uppercase tracking-wider">
                        Attach Multiple Photos ({propForm.images?.length || 1})
                      </h4>
                      <p className="text-[11px] text-pine-600">
                        Drag &amp; drop multiple photos or click to attach from your computer/phone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Existing Photos Grid */}
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
                  {(propForm.images || [propForm.image]).map((imgUrl, i) => (
                    <div
                      key={`${imgUrl}-${i}`}
                      className="group relative h-24 overflow-hidden rounded-xl border border-highlands-900/15 bg-white shadow-2xs"
                    >
                      <img src={imgUrl} alt={`Angle ${i + 1}`} className="h-full w-full object-cover" />

                      {i === 0 && (
                        <span className="absolute top-1 left-1 rounded bg-gold-400 px-1.5 py-0.5 text-[9px] font-bold text-highlands-950 shadow-xs">
                          PRIMARY
                        </span>
                      )}

                      <div className="absolute inset-0 bg-highlands-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                        {i !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(i)}
                            className="rounded bg-gold-400 text-highlands-950 px-2 py-0.5 text-[10px] font-semibold hover:bg-gold-300"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePropImage(i)}
                          className="rounded bg-rose-500 text-white px-2 py-0.5 text-[10px] font-semibold hover:bg-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <FileDropzone
                  label="Attach More Photos"
                  subtitle="Drop image files here to add more photo angles"
                  multiple={true}
                  onImageSelected={handleAddPropImage}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-highlands-900 uppercase">
                  Description / Blurb
                </label>
                <textarea
                  rows={2}
                  value={propForm.blurb}
                  onChange={(e) => setPropForm({ ...propForm, blurb: e.target.value })}
                  placeholder="Key features and outlook of this unit..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2 text-sm text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-3.5 text-sm font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5"
                >
                  {editingProp ? "Save Property & Promo Changes" : "Publish Listing & Promo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
