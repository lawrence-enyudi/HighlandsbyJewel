import { useState } from "react";
import { Plus, Trash2, Edit2, Calculator, X, Check } from "lucide-react";
import type { InventoryUnit, ProjectFile } from "@/context/SiteContext";
import { INVENTORY_STATUSES } from "@/utils/paymentComputation";
import { cn } from "@/utils/cn";

function inventoryKind(category: ProjectFile["category"]): InventoryUnit["kind"] {
  return category === "Condo" ? "unit" : "lot";
}

function emptyUnit(category: ProjectFile["category"]): Omit<InventoryUnit, "id" | "createdAt" | "updatedAt"> {
  const kind = inventoryKind(category);
  return {
    kind,
    block: kind === "lot" ? "" : undefined,
    lot: kind === "lot" ? "" : undefined,
    unitNumber: kind === "unit" ? "" : undefined,
    area: "",
    status: "Available",
    tcp: 0,
    remarks: "",
  };
}

function formatLocation(unit: InventoryUnit): string {
  if (unit.kind === "unit") return unit.unitNumber ? `Unit ${unit.unitNumber}` : "—";
  const parts = [unit.block && `Blk ${unit.block}`, unit.lot && `Lot ${unit.lot}`].filter(Boolean);
  return parts.length ? parts.join(" ") : "—";
}

type ProjectInventoryProps = {
  project: ProjectFile;
  onUpdateInventory: (inventory: InventoryUnit[]) => void;
  onCompute: (unit: InventoryUnit) => void;
};

export default function ProjectInventory({ project, onUpdateInventory, onCompute }: ProjectInventoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<InventoryUnit, "id" | "createdAt" | "updatedAt">>(
    emptyUnit(project.category),
  );
  const [isAdding, setIsAdding] = useState(false);

  const isLotStyle = inventoryKind(project.category) === "lot";
  const inventory = project.inventory || [];

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyUnit(project.category));
    setIsAdding(true);
  };

  const startEdit = (unit: InventoryUnit) => {
    setIsAdding(false);
    setEditingId(unit.id);
    setForm({
      kind: unit.kind,
      block: unit.block,
      lot: unit.lot,
      unitNumber: unit.unitNumber,
      area: unit.area,
      status: unit.status,
      tcp: unit.tcp,
      remarks: unit.remarks,
    });
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const saveUnit = () => {
    const now = new Date().toISOString();
    if (editingId) {
      onUpdateInventory(
        inventory.map((u) =>
          u.id === editingId ? { ...u, ...form, updatedAt: now } : u,
        ),
      );
    } else {
      const unit: InventoryUnit = {
        ...form,
        id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };
      onUpdateInventory([unit, ...inventory]);
    }
    cancelForm();
  };

  const deleteUnit = (id: string) => {
    if (!window.confirm("Remove this inventory item?")) return;
    onUpdateInventory(inventory.filter((u) => u.id !== id));
    if (editingId === id) cancelForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-highlands-900">
            Lot / Unit Inventory ({inventory.length})
          </h4>
          <p className="mt-0.5 text-[11px] text-pine-600">
            {isLotStyle
              ? "Track blocks, lots, TCP, and status — then Compute for instant payment sheets."
              : "Track unit numbers, TCP, and status — then Compute for instant payment sheets."}
          </p>
        </div>
        <button
          type="button"
          onClick={startAdd}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold-400/40 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-800 hover:bg-gold-100"
        >
          <Plus className="h-3.5 w-3.5" /> Add {isLotStyle ? "Lot" : "Unit"}
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="rounded-xl border border-gold-400/30 bg-gold-50/40 p-4 space-y-3">
          <p className="text-[11px] font-bold uppercase text-gold-800">
            {editingId ? "Edit Inventory Item" : "New Inventory Item"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {isLotStyle ? (
              <>
                <div>
                  <label className="text-[10px] font-bold uppercase">Blk</label>
                  <input
                    type="text"
                    value={form.block || ""}
                    onChange={(e) => setForm({ ...form, block: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase">Lot</label>
                  <input
                    type="text"
                    value={form.lot || ""}
                    onChange={(e) => setForm({ ...form, lot: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                  />
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase">Unit Number</label>
                <input
                  type="text"
                  value={form.unitNumber || ""}
                  onChange={(e) => setForm({ ...form, unitNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold uppercase">Area</label>
              <input
                type="text"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="e.g. 416 sq. m"
                className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as InventoryUnit["status"] })}
                className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
              >
                {INVENTORY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase">TCP (List Price)</label>
              <input
                type="number"
                min={0}
                value={form.tcp || ""}
                onChange={(e) => setForm({ ...form, tcp: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-gold-800"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="text-[10px] font-bold uppercase">Remarks</label>
              <input
                type="text"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-white px-3 py-1.5 text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelForm}
              className="inline-flex items-center gap-1 rounded-lg border border-highlands-900/10 bg-white px-3 py-1.5 text-xs font-semibold"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
            <button
              type="button"
              onClick={saveUnit}
              className="inline-flex items-center gap-1 rounded-lg bg-highlands-800 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Check className="h-3 w-3" /> Save
            </button>
          </div>
        </div>
      )}

      {inventory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-highlands-900/15 bg-cream-50/50 p-8 text-center text-xs text-pine-600">
          No inventory yet. Add {isLotStyle ? "lots" : "units"} to start computing payments.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-highlands-900/10">
          <table className="w-full min-w-[720px] text-xs">
            <thead>
              <tr className="bg-highlands-800 text-white text-[10px] uppercase">
                {isLotStyle ? (
                  <>
                    <th className="px-3 py-2 text-left">Blk</th>
                    <th className="px-3 py-2 text-left">Lot</th>
                  </>
                ) : (
                  <th className="px-3 py-2 text-left">Unit No.</th>
                )}
                <th className="px-3 py-2 text-left">Area</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">TCP</th>
                <th className="px-3 py-2 text-left">Remarks</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-highlands-900/8 bg-white">
              {inventory.map((unit) => (
                <tr key={unit.id} className="hover:bg-cream-50/60">
                  {isLotStyle ? (
                    <>
                      <td className="px-3 py-2 font-medium">{unit.block || "—"}</td>
                      <td className="px-3 py-2 font-medium">{unit.lot || "—"}</td>
                    </>
                  ) : (
                    <td className="px-3 py-2 font-medium">{unit.unitNumber || "—"}</td>
                  )}
                  <td className="px-3 py-2">{unit.area || "—"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                        unit.status === "Available"
                          ? "border-highlands-600/30 bg-highlands-50 text-highlands-800"
                          : unit.status === "Sold"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : "border-pine-600/20 bg-pine-50 text-pine-700",
                      )}
                    >
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-gold-800">
                    ₱{unit.tcp.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-2 text-pine-600">{unit.remarks || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onCompute(unit)}
                        className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-2.5 py-1 text-[10px] font-bold text-highlands-950"
                        title={`Compute for ${formatLocation(unit)}`}
                      >
                        <Calculator className="h-3 w-3" /> Compute
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(unit)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-highlands-900/10 hover:bg-cream-50"
                        aria-label="Edit"
                      >
                        <Edit2 className="h-3 w-3 text-gold-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUnit(unit.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
