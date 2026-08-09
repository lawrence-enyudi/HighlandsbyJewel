import { useState, useRef, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import { useSite, type InventoryUnit, type ProjectFile } from "@/context/SiteContext";
import { fileToCompressedDataUrl } from "@/utils/cloudSync";
import { createPresetTerms } from "@/utils/paymentComputation";
import ProjectInventory from "./ProjectInventory";
import PaymentSchemeEditor from "./PaymentSchemeEditor";
import ComputationWorkflow from "./ComputationWorkflow";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Upload,
  Map,
  DollarSign,
  Calculator,
  Search,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Check,
  Package,
} from "lucide-react";
import { cn } from "@/utils/cn";

const DISTRICTS = ["The Highlands", "The Midlands", "Midlands West", "The Greenlands"];
const CATEGORIES: ProjectFile["category"][] = ["Lot", "Condo", "Townhouse"];
const STATUSES: ProjectFile["status"][] = ["Active", "Pre-Selling", "Sold Out", "Archived"];

function emptyProject(): Omit<ProjectFile, "id" | "createdAt" | "updatedAt"> {
  return {
    name: "",
    district: DISTRICTS[0],
    category: "Lot",
    status: "Active",
    priceRange: "",
    lotSizes: "",
    mapImages: [],
    priceListImages: [],
    paymentTerms: createPresetTerms(),
    inventory: [],
    notes: "",
  };
}

export default function ProjectsManager() {
  const { projectFiles, addProjectFile, updateProjectFile, deleteProjectFile } = useSite();

  const [search, setSearch] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [editing, setEditing] = useState<ProjectFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<ProjectFile, "id" | "createdAt" | "updatedAt">>(emptyProject());
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [computeTarget, setComputeTarget] = useState<{ project: ProjectFile; unit: InventoryUnit } | null>(null);

  const mapInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [isDraggingPrice, setIsDraggingPrice] = useState(false);

  const filtered = projectFiles.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = filterDistrict === "All" || p.district === filterDistrict;
    return matchSearch && matchDistrict;
  });

  const handleOpenAdd = () => {
    setEditing(null);
    setForm(emptyProject());
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectFile) => {
    setEditing(p);
    setForm({
      name: p.name,
      district: p.district,
      category: p.category,
      status: p.status,
      priceRange: p.priceRange,
      lotSizes: p.lotSizes,
      mapImages: [...p.mapImages],
      priceListImages: [...p.priceListImages],
      paymentTerms: p.paymentTerms.map((t) => ({ ...t })),
      inventory: (p.inventory || []).map((u) => ({ ...u })),
      notes: p.notes,
    });
    setIsModalOpen(true);
  };

  const processFile = async (file: File, callback: (url: string) => void) => {
    if (!file.type.startsWith("image/")) return;
    try {
      callback(await fileToCompressedDataUrl(file));
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) callback(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, target: "map" | "price") => {
    e.preventDefault();
    target === "map" ? setIsDraggingMap(false) : setIsDraggingPrice(false);
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        processFile(file, (url) => {
          setForm((prev) => ({
            ...prev,
            [target === "map" ? "mapImages" : "priceListImages"]: [
              ...(target === "map" ? prev.mapImages : prev.priceListImages),
              url,
            ],
          }));
        });
      });
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>, target: "map" | "price") => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        processFile(file, (url) => {
          setForm((prev) => ({
            ...prev,
            [target === "map" ? "mapImages" : "priceListImages"]: [
              ...(target === "map" ? prev.mapImages : prev.priceListImages),
              url,
            ],
          }));
        });
      });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) updateProjectFile(editing.id, form);
    else addProjectFile(form);
    setIsModalOpen(false);
  };

  const handleInventoryUpdate = (projectId: string, inventory: InventoryUnit[]) => {
    updateProjectFile(projectId, { inventory });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-normal text-highlands-900">
            Projects, Inventory &amp; Computations
          </h2>
          <p className="mt-1 text-xs text-pine-600">
            Manage projects, lot/unit inventory, custom payment schemes, and generate Belle Corp-style computation sheets.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-5 py-2.5 text-xs font-semibold text-highlands-950 shadow-xs transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-pine-600/50" />
          <input
            type="text"
            placeholder="Search project name or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-highlands-900/15 bg-cream-50/70 py-2 pr-4 pl-9 text-xs text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:bg-white focus:outline-none"
          />
        </div>
        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          className="rounded-full border border-highlands-900/15 bg-cream-50/70 px-3 py-2 text-xs text-highlands-900 font-medium focus:border-gold-500 focus:bg-white focus:outline-none"
        >
          <option value="All">All Districts</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-highlands-900/10 bg-cream-50/50 p-12 text-center text-pine-600">
          <FileSpreadsheet className="mx-auto h-10 w-10 text-pine-600/30" />
          <p className="mt-3 text-sm font-medium">No projects yet.</p>
          <p className="mt-1 text-xs">Add your first project, then build its lot/unit inventory.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((project) => {
            const isExpanded = expandedProject === project.id;
            const inventoryCount = (project.inventory || []).length;
            return (
              <div
                key={project.id}
                className="overflow-hidden rounded-2xl border border-highlands-900/10 bg-cream-50/40 transition-all hover:border-gold-500/30"
              >
                <div
                  className="flex cursor-pointer items-center justify-between gap-3 p-4 sm:p-5"
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-50 border border-gold-400/40 text-gold-800">
                      <Map className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-medium text-highlands-900 truncate">{project.name}</h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="font-semibold text-gold-700">{project.district}</span>
                        <span className="text-pine-600">·</span>
                        <span className="text-pine-600">{project.category}</span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 font-bold uppercase",
                            project.status === "Active"
                              ? "border-highlands-600/30 bg-highlands-50 text-highlands-800"
                              : "border-pine-600/20 bg-pine-50 text-pine-700",
                          )}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-pine-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-gold-600" />{inventoryCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Map className="h-3 w-3 text-gold-600" />{project.mapImages.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calculator className="h-3 w-3 text-gold-600" />{project.paymentTerms.length}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-pine-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-pine-600" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-highlands-900/8 bg-white p-4 sm:p-6 space-y-6">
                    <ProjectInventory
                      project={project}
                      onUpdateInventory={(inventory) => handleInventoryUpdate(project.id, inventory)}
                      onCompute={(unit) => setComputeTarget({ project, unit })}
                    />

                    {project.mapImages.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900">
                          <Map className="h-3.5 w-3.5 text-gold-700" /> Site Maps ({project.mapImages.length})
                        </h4>
                        <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3">
                          {project.mapImages.map((img, idx) => (
                            <a
                              key={idx}
                              href={img}
                              target="_blank"
                              rel="noreferrer"
                              className="group relative overflow-hidden rounded-xl border border-highlands-900/10 shadow-2xs hover:border-gold-500/40 hover:shadow-md transition-all"
                            >
                              <img src={img} alt={`Map ${idx + 1}`} className="h-28 w-full object-cover sm:h-36" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.priceListImages.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900">
                          <DollarSign className="h-3.5 w-3.5 text-gold-700" /> Price Lists ({project.priceListImages.length})
                        </h4>
                        <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3">
                          {project.priceListImages.map((img, idx) => (
                            <a
                              key={idx}
                              href={img}
                              target="_blank"
                              rel="noreferrer"
                              className="group relative overflow-hidden rounded-xl border border-highlands-900/10 shadow-2xs hover:border-gold-500/40 hover:shadow-md transition-all"
                            >
                              <img src={img} alt={`Price ${idx + 1}`} className="h-28 w-full object-cover sm:h-36" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 border-t border-highlands-900/8 pt-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(project)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-highlands-900/10 bg-cream-50 px-3 py-1.5 text-xs font-semibold text-highlands-900 hover:bg-cream-100"
                      >
                        <Edit2 className="h-3 w-3 text-gold-600" /> Edit Project
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${project.name}"?`)) deleteProjectFile(project.id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {computeTarget && (
        <ComputationWorkflow
          project={computeTarget.project}
          unit={computeTarget.unit}
          onClose={() => setComputeTarget(null)}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-highlands-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div
            className="animate-scale-in relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-highlands-900/10 bg-white p-6 shadow-2xl sm:p-8 text-highlands-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-highlands-900/8 pb-4">
              <h2 className="font-display text-xl font-normal">
                {editing ? `Edit: ${editing.name}` : "Add New Project"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-cream-50 hover:bg-cream-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Primrose Parks"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">District</label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm font-medium focus:border-gold-500 focus:bg-white focus:outline-none"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ProjectFile["category"] })}
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:bg-white focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ProjectFile["status"] })}
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:bg-white focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Price Range</label>
                  <input
                    type="text"
                    value={form.priceRange}
                    onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                    placeholder="₱9M – ₱22M"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Lot Sizes</label>
                  <input
                    type="text"
                    value={form.lotSizes}
                    onChange={(e) => setForm({ ...form, lotSizes: e.target.value })}
                    placeholder="400–900 sqm"
                    className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <PaymentSchemeEditor
                terms={form.paymentTerms}
                onChange={(paymentTerms) => setForm({ ...form, paymentTerms })}
              />

              <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900">
                  <Map className="h-4 w-4 text-gold-700" /> Site Development Maps ({form.mapImages.length})
                </h4>
                {form.mapImages.length > 0 && (
                  <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
                    {form.mapImages.map((img, idx) => (
                      <div key={idx} className="group relative h-24 overflow-hidden rounded-xl border border-highlands-900/15 bg-white shadow-2xs">
                        <img src={img} alt={`Map ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              mapImages: prev.mapImages.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingMap(true); }}
                  onDragLeave={() => setIsDraggingMap(false)}
                  onDrop={(e) => handleDrop(e, "map")}
                  onClick={() => mapInputRef.current?.click()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all",
                    isDraggingMap ? "border-gold-500 bg-gold-50" : "border-highlands-900/15 bg-white hover:border-gold-500 hover:bg-cream-50",
                  )}
                >
                  <input type="file" ref={mapInputRef} multiple onChange={(e) => handleFileInput(e, "map")} accept="image/*" className="hidden" />
                  <Upload className="h-5 w-5 text-gold-700" />
                  <p className="mt-1 text-xs font-bold text-highlands-900">Drop map photos here, or click to attach</p>
                </div>
              </div>

              <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900">
                  <DollarSign className="h-4 w-4 text-gold-700" /> Price List Sheets ({form.priceListImages.length})
                </h4>
                {form.priceListImages.length > 0 && (
                  <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
                    {form.priceListImages.map((img, idx) => (
                      <div key={idx} className="group relative h-24 overflow-hidden rounded-xl border border-highlands-900/15 bg-white shadow-2xs">
                        <img src={img} alt={`Price ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              priceListImages: prev.priceListImages.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingPrice(true); }}
                  onDragLeave={() => setIsDraggingPrice(false)}
                  onDrop={(e) => handleDrop(e, "price")}
                  onClick={() => priceInputRef.current?.click()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all",
                    isDraggingPrice ? "border-gold-500 bg-gold-50" : "border-highlands-900/15 bg-white hover:border-gold-500 hover:bg-cream-50",
                  )}
                >
                  <input type="file" ref={priceInputRef} multiple onChange={(e) => handleFileInput(e, "price")} accept="image/*" className="hidden" />
                  <Upload className="h-5 w-5 text-gold-700" />
                  <p className="mt-1 text-xs font-bold text-highlands-900">Drop price list photos here, or click to attach</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-highlands-900 uppercase">Project Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-3.5 text-sm font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5"
              >
                <Check className="inline h-4 w-4 mr-1" />
                {editing ? "Save Changes" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
