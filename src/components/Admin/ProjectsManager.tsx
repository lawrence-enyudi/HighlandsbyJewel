import { useState, useRef, useMemo, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import { useSite, type ProjectFile, type PaymentTerm } from "@/context/SiteContext";
import { fileToCompressedDataUrl } from "@/utils/cloudSync";
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
  Printer,
} from "lucide-react";
import { cn } from "@/utils/cn";

const DISTRICTS = ["The Highlands", "The Midlands", "Midlands West", "The Greenlands"];
const CATEGORIES: ProjectFile["category"][] = ["Lot", "Condo", "Townhouse"];
const STATUSES: ProjectFile["status"][] = ["Active", "Pre-Selling", "Sold Out", "Archived"];

// ─── COMPUTATION ENGINE (mirrors the Belle Corporation spreadsheet logic) ───

type ComputedSchedule = {
  paymentNo: number;
  dateDue: string;
  particulars: string;
  amountDue: number;
  outstandingBalance: number;
};

type ComputedTerm = {
  term: PaymentTerm;
  listPrice: number;
  cashDiscount: number;
  termDiscount: number;
  promoDiscount: number;
  extraDiscount: number;
  totalDiscounts: number;
  subtotalAfterDiscount: number;
  otherCharges: number;
  totalContractPrice: number;
  spotAmount: number;
  balanceAfterSpot: number;
  monthlyAmount: number;
  schedule: ComputedSchedule[];
};

function computeTerm(term: PaymentTerm, listPrice: number, startDate: Date): ComputedTerm {
  const cashDiscount = listPrice * (term.cashDiscountPercent / 100);
  const termDiscount = listPrice * (term.termDiscountPercent / 100);
  const promoDiscount = listPrice * (term.promoDiscountPercent / 100);
  const extraDiscount = listPrice * (term.extraDiscountPercent / 100);
  const totalDiscounts = cashDiscount + termDiscount + promoDiscount + extraDiscount;
  const subtotalAfterDiscount = listPrice - totalDiscounts;
  const otherCharges = subtotalAfterDiscount * (term.otherChargesPercent / 100);
  const totalContractPrice = subtotalAfterDiscount + otherCharges;

  const reservationFee = term.reservationFee || 100000;
  const afterReservation = totalContractPrice - reservationFee;

  const spotAmount = afterReservation * (term.spotPercent / 100);
  const balanceAfterSpot = afterReservation - spotAmount;
  const months = term.balanceMonths || 0;
  const monthlyAmount = months > 0 ? balanceAfterSpot / months : 0;

  // Build payment schedule
  const schedule: ComputedSchedule[] = [];
  let outstanding = totalContractPrice;

  // Payment 0: Reservation Fee
  outstanding -= reservationFee;
  schedule.push({
    paymentNo: 0,
    dateDue: formatDate(startDate),
    particulars: "Reservation Fee",
    amountDue: reservationFee,
    outstandingBalance: outstanding,
  });

  // Payment 1: Spot DP (if any)
  if (spotAmount > 0) {
    const spotDate = addMonths(startDate, 1);
    outstanding -= spotAmount;
    schedule.push({
      paymentNo: 1,
      dateDue: formatDate(spotDate),
      particulars: term.spotPercent === 100 ? "Spot Cash" : "Spot DP",
      amountDue: spotAmount,
      outstandingBalance: Math.max(0, outstanding),
    });
  }

  // Monthly amortizations
  if (months > 0 && monthlyAmount > 0) {
    const startIdx = spotAmount > 0 ? 2 : 1;
    const monthOffset = spotAmount > 0 ? 2 : 1;
    for (let i = 0; i < months; i++) {
      const d = addMonths(startDate, monthOffset + i);
      outstanding -= monthlyAmount;
      schedule.push({
        paymentNo: startIdx + i,
        dateDue: formatDate(d),
        particulars: `MA-${i + 1}`,
        amountDue: monthlyAmount,
        outstandingBalance: Math.max(0, outstanding),
      });
    }
  }

  return {
    term,
    listPrice,
    cashDiscount,
    termDiscount,
    promoDiscount,
    extraDiscount,
    totalDiscounts,
    subtotalAfterDiscount,
    otherCharges,
    totalContractPrice,
    spotAmount,
    balanceAfterSpot,
    monthlyAmount,
    schedule,
  };
}

function addMonths(date: Date, m: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + m);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-PH", { day: "2-digit", month: "short", year: "numeric" });
}

function fmt(n: number): string {
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function _emptyTerm(): PaymentTerm {
  return {
    id: `term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label: "",
    cashDiscountPercent: 0,
    termDiscountPercent: 0,
    promoDiscountPercent: 0,
    extraDiscountPercent: 0,
    otherChargesPercent: 5,
    spotPercent: 100,
    balanceMonths: 0,
    reservationFee: 100000,
    notes: "",
  };
}
void _emptyTerm; // keep available for future use

const PRESET_TERMS: Omit<PaymentTerm, "id">[] = [
  { label: "100% Spot Cash (30 days)", cashDiscountPercent: 1.36, termDiscountPercent: 20, promoDiscountPercent: 1, extraDiscountPercent: 0, otherChargesPercent: 5, spotPercent: 100, balanceMonths: 0, reservationFee: 100000, notes: "" },
  { label: "50% Spot / 50% in 60 months", cashDiscountPercent: 1.36, termDiscountPercent: 10, promoDiscountPercent: 1, extraDiscountPercent: 0, otherChargesPercent: 5, spotPercent: 50, balanceMonths: 60, reservationFee: 100000, notes: "" },
  { label: "20% Spot / 80% in 60 months", cashDiscountPercent: 1.36, termDiscountPercent: 5, promoDiscountPercent: 1, extraDiscountPercent: 0, otherChargesPercent: 5, spotPercent: 20, balanceMonths: 60, reservationFee: 100000, notes: "" },
  { label: "100% in 60 months (No DP)", cashDiscountPercent: 1.36, termDiscountPercent: 1, promoDiscountPercent: 1, extraDiscountPercent: 0, otherChargesPercent: 5, spotPercent: 0, balanceMonths: 60, reservationFee: 100000, notes: "" },
];

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
    paymentTerms: PRESET_TERMS.map((t) => ({ ...t, id: `term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
    notes: "",
  };
}

// ─── COMPUTATION SHEET VIEWER (Belle Corp spreadsheet style) ───

function ComputationSheet({
  computed,
  projectName,
  buyerName,
  blockLot,
  lotArea,
  paymentTermLabel,
  startDate,
}: {
  computed: ComputedTerm;
  projectName: string;
  buyerName: string;
  blockLot: string;
  lotArea: string;
  paymentTermLabel: string;
  startDate: string;
}) {
  return (
    <div className="space-y-5 text-xs text-highlands-900">
      {/* Header */}
      <div className="rounded-xl border border-highlands-900/15 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-highlands-900">PAYMENT COMPUTATION TABLE</p>
            <p className="text-sm font-semibold text-gold-700">{projectName}</p>
          </div>
          <span className="text-[10px] font-bold text-pine-600 uppercase">Annex A</span>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="rounded-xl border border-highlands-900/15 bg-white p-4">
        <table className="w-full text-xs">
          <tbody>
            <tr><td className="py-1 font-bold w-40">NAME OF BUYER</td><td className="py-1 font-semibold text-highlands-900">{buyerName || "—"}</td></tr>
            <tr><td className="py-1 font-bold">BLOCK & LOT NO.</td><td className="py-1">{blockLot || "—"}</td></tr>
            <tr><td className="py-1 font-bold">LOT AREA</td><td className="py-1">{lotArea || "—"}</td></tr>
            <tr><td className="py-1 font-bold">LIST PRICE</td><td className="py-1 font-semibold text-gold-700">₱{fmt(computed.listPrice)}</td></tr>
            <tr><td className="py-1 font-bold">PAYMENT TERM</td><td className="py-1 font-semibold text-highlands-700">{paymentTermLabel}</td></tr>
            <tr><td className="py-1 font-bold">DATE</td><td className="py-1">{startDate}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Contract Price Computation */}
      <div className="rounded-xl border border-highlands-900/15 bg-white p-4">
        <p className="font-bold text-highlands-900 uppercase tracking-wider mb-2">Contract Price Computation:</p>
        <table className="w-full text-xs">
          <tbody>
            <tr><td className="py-1">LIST PRICE (VAT-in)</td><td></td><td className="py-1 text-right font-medium">₱{fmt(computed.listPrice)}</td></tr>
            {computed.cashDiscount > 0 && <tr><td className="py-1 text-pine-600">Less: Cash Discount</td><td></td><td className="py-1 text-right text-rose-600">₱{fmt(computed.cashDiscount)}</td></tr>}
            {computed.termDiscount > 0 && <tr><td className="py-1 text-pine-600">Less: Term Discount</td><td className="text-pine-600">{computed.term.termDiscountPercent}%</td><td className="py-1 text-right text-rose-600">₱{fmt(computed.termDiscount)}</td></tr>}
            {computed.promoDiscount > 0 && <tr><td className="py-1 text-pine-600">Less: Promo Discount</td><td className="text-pine-600">{computed.term.promoDiscountPercent}%</td><td className="py-1 text-right text-rose-600">₱{fmt(computed.promoDiscount)}</td></tr>}
            {computed.extraDiscount > 0 && <tr><td className="py-1 text-pine-600">Less: Extra Discount</td><td className="text-pine-600">{computed.term.extraDiscountPercent}%</td><td className="py-1 text-right text-rose-600">₱{fmt(computed.extraDiscount)}</td></tr>}
            {computed.otherCharges > 0 && <tr><td className="py-1 text-pine-600">Add: Other Charges (O.C.)</td><td className="text-pine-600">{computed.term.otherChargesPercent}%</td><td className="py-1 text-right text-highlands-700 font-medium border-t border-highlands-900/10">₱{fmt(computed.otherCharges)}</td></tr>}
            <tr className="border-t-2 border-highlands-900/20"><td className="py-2 font-bold text-highlands-900 text-sm">Total Contract Price</td><td></td><td className="py-2 text-right font-bold text-highlands-900 text-sm">₱{fmt(computed.totalContractPrice)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Payment Schedule */}
      <div className="rounded-xl border border-highlands-900/15 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-highlands-800 text-white text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3 text-center font-bold">Payment No.</th>
                <th className="py-2.5 px-3 text-center font-bold">Date Due</th>
                <th className="py-2.5 px-3 text-center font-bold">Particulars</th>
                <th className="py-2.5 px-3 text-right font-bold">Amount Due</th>
                <th className="py-2.5 px-3 text-right font-bold">Outstanding Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-highlands-900/6">
              {computed.schedule.map((row) => (
                <tr
                  key={row.paymentNo}
                  className={cn(
                    "hover:bg-cream-50/60",
                    row.particulars === "Reservation Fee" && "bg-gold-50/40",
                    row.particulars === "Spot Cash" || row.particulars === "Spot DP" ? "bg-gold-50/40" : "",
                  )}
                >
                  <td className="py-2 px-3 text-center font-medium">{row.paymentNo}</td>
                  <td className="py-2 px-3 text-center">{row.dateDue}</td>
                  <td className="py-2 px-3 text-center font-medium">{row.particulars}</td>
                  <td className="py-2 px-3 text-right font-semibold text-highlands-900">₱{fmt(row.amountDue)}</td>
                  <td className="py-2 px-3 text-right text-pine-700">₱{fmt(row.outstandingBalance)}</td>
                </tr>
              ))}
              <tr className="bg-highlands-800 text-white font-bold">
                <td colSpan={3} className="py-2.5 px-3 text-right uppercase text-[10px] tracking-wider">Total</td>
                <td className="py-2.5 px-3 text-right">₱{fmt(computed.totalContractPrice)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-highlands-900/10 bg-cream-50/60 p-3 text-[10.5px] text-pine-600 space-y-1">
        <p className="font-bold text-highlands-900 uppercase">Notes:</p>
        <p>1. This computation sheet only intends to provide an indicative reservation price. Prices, terms and conditions are subject to change without prior notice.</p>
        <p>2. Submission of post-dated checks is required.</p>
        <p>3. Price includes the Value Added Tax, currently at 12%.</p>
        <p>4. Any government mandated adjustments on taxes shall be applied accordingly.</p>
        {computed.term.notes && <p className="font-semibold text-highlands-900">• {computed.term.notes}</p>}
      </div>
    </div>
  );
}

// ─── QUICK COMPUTATION TOOL (standalone, not tied to a project) ───

function QuickComputationTool() {
  const [buyerName, setBuyerName] = useState("");
  const [projectName, setProjectName] = useState("Sycamore Heights");
  const [blockLot, setBlockLot] = useState("");
  const [lotArea, setLotArea] = useState("");
  const [listPrice, setListPrice] = useState(22050000);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedTermIdx, setSelectedTermIdx] = useState(0);
  const [terms, _setTerms] = useState<PaymentTerm[]>(
    PRESET_TERMS.map((t) => ({ ...t, id: `qt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
  );

  const computed = useMemo(() => {
    if (!terms[selectedTermIdx] || listPrice <= 0) return null;
    return computeTerm(terms[selectedTermIdx], listPrice, new Date(startDate));
  }, [terms, selectedTermIdx, listPrice, startDate]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Payment Computation - ${projectName}</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; padding: 20px; font-size: 11px; color: #122b28; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 4px 8px; text-align: left; }
        th { background: #0f4a34; color: white; font-size: 9px; text-transform: uppercase; }
        tr:nth-child(even) { background: #f4faf7; }
        .text-right { text-align: right; }
        .font-bold { font-weight: 700; }
        .border-t { border-top: 2px solid #0a3527; }
      </style></head><body>
      ${printRef.current.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-highlands-900">
            <Calculator className="h-4 w-4 text-gold-700" />
            Quick Payment Computation Tool
          </h3>
          <p className="mt-0.5 text-[11px] text-pine-600">
            Enter buyer & lot details, select a payment scheme, and get an instant computation sheet — just like the Belle Corporation spreadsheet.
          </p>
        </div>
        {computed && (
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-full border border-highlands-900/15 bg-white px-4 py-2 text-xs font-semibold text-highlands-900 shadow-2xs hover:bg-cream-50"
          >
            <Printer className="h-3.5 w-3.5 text-gold-700" /> Print / Save PDF
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-gold-500/30 bg-gold-50/60 p-4 space-y-4">
        <p className="text-[11px] font-bold text-gold-800 uppercase tracking-wider">
          Step 1: Enter Buyer &amp; Lot Details
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-[11px] font-bold text-highlands-900 uppercase">Buyer Name</label>
            <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="e.g. GELA" className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-gold-100/60 px-3 py-2 text-xs font-semibold text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-highlands-900 uppercase">Project Name</label>
            <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Sycamore Heights" className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-gold-100/60 px-3 py-2 text-xs font-semibold text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-highlands-900 uppercase">Block &amp; Lot No.</label>
            <input type="text" value={blockLot} onChange={(e) => setBlockLot(e.target.value)} placeholder="e.g. Block 47 Lot 10" className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-gold-100/60 px-3 py-2 text-xs font-semibold text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-highlands-900 uppercase">Lot Area</label>
            <input type="text" value={lotArea} onChange={(e) => setLotArea(e.target.value)} placeholder="e.g. 416 sq. m" className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-gold-100/60 px-3 py-2 text-xs font-semibold text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-highlands-900 uppercase">List Price (VAT-in)</label>
            <input type="number" value={listPrice} onChange={(e) => setListPrice(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-gold-100/60 px-3 py-2 text-xs font-bold text-gold-800 focus:border-gold-500 focus:bg-white focus:outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-highlands-900 uppercase">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full rounded-lg border border-highlands-900/15 bg-gold-100/60 px-3 py-2 text-xs text-highlands-900 focus:border-gold-500 focus:bg-white focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Payment Term Selector */}
      <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
        <p className="text-[11px] font-bold text-gold-800 uppercase tracking-wider">
          Step 2: Select Payment Scheme
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {terms.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTermIdx(idx)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all text-xs",
                selectedTermIdx === idx
                  ? "border-gold-500 bg-gold-50 shadow-xs ring-2 ring-gold-400/40"
                  : "border-highlands-900/10 bg-white hover:border-gold-400/50",
              )}
            >
              <p className="font-bold text-highlands-900">{t.label || `Scheme ${idx + 1}`}</p>
              <p className="mt-0.5 text-[10px] text-pine-600">
                {t.spotPercent > 0 ? `${t.spotPercent}% Spot` : "No DP"}
                {t.balanceMonths > 0 ? ` + ${t.balanceMonths} mo.` : ""}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Computed Result */}
      {computed && (
        <div ref={printRef}>
          <ComputationSheet
            computed={computed}
            projectName={projectName}
            buyerName={buyerName}
            blockLot={blockLot}
            lotArea={lotArea}
            paymentTermLabel={terms[selectedTermIdx]?.label || ""}
            startDate={new Date(startDate).toLocaleDateString("en-PH", { day: "2-digit", month: "short", year: "numeric" })}
          />
        </div>
      )}
    </div>
  );
}

// ─── MAIN PROJECTS MANAGER COMPONENT ───

export default function ProjectsManager() {
  const { projectFiles, addProjectFile, updateProjectFile, deleteProjectFile } = useSite();

  const [search, setSearch] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [editing, setEditing] = useState<ProjectFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<ProjectFile, "id" | "createdAt" | "updatedAt">>(emptyProject());
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"projects" | "compute">("projects");

  // Image upload state
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
      name: p.name, district: p.district, category: p.category, status: p.status,
      priceRange: p.priceRange, lotSizes: p.lotSizes,
      mapImages: [...p.mapImages], priceListImages: [...p.priceListImages],
      paymentTerms: p.paymentTerms.map((t) => ({ ...t })),
      notes: p.notes,
    });
    setIsModalOpen(true);
  };

  const processFile = async (file: File, callback: (url: string) => void) => {
    if (!file.type.startsWith("image/")) return;
    try { callback(await fileToCompressedDataUrl(file)); } catch {
      const reader = new FileReader();
      reader.onload = (e) => { if (e.target?.result) callback(e.target.result as string); };
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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-normal text-highlands-900">
            Projects, Maps &amp; Computations
          </h2>
          <p className="mt-1 text-xs text-pine-600">
            Digital filing cabinet — maps, price lists, and instant Belle Corp-style computation sheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-highlands-900/12 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveView("projects")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                activeView === "projects"
                  ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-xs"
                  : "text-highlands-900/60 hover:text-highlands-900",
              )}
            >
              <FileSpreadsheet className="inline h-3.5 w-3.5 mr-1" /> Projects
            </button>
            <button
              type="button"
              onClick={() => setActiveView("compute")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                activeView === "compute"
                  ? "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-highlands-950 shadow-xs"
                  : "text-highlands-900/60 hover:text-highlands-900",
              )}
            >
              <Calculator className="inline h-3.5 w-3.5 mr-1" /> Quick Computation
            </button>
          </div>
          {activeView === "projects" && (
            <button type="button" onClick={handleOpenAdd} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 px-5 py-2.5 text-xs font-semibold text-highlands-950 shadow-xs transition-transform hover:-translate-y-0.5">
              <Plus className="h-4 w-4" /> Add Project
            </button>
          )}
        </div>
      </div>

      {/* Quick Computation Tool (standalone tab) */}
      {activeView === "compute" && (
        <div className="mt-6">
          <QuickComputationTool />
        </div>
      )}

      {/* Projects List */}
      {activeView === "projects" && (
        <>
          {/* Search & Filter */}
          <div className="mt-5 flex flex-wrap gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-pine-600/50" />
              <input type="text" placeholder="Search project name or district..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-full border border-highlands-900/15 bg-cream-50/70 py-2 pr-4 pl-9 text-xs text-highlands-900 placeholder-pine-600/40 focus:border-gold-500 focus:bg-white focus:outline-none" />
            </div>
            <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="rounded-full border border-highlands-900/15 bg-cream-50/70 px-3 py-2 text-xs text-highlands-900 font-medium focus:border-gold-500 focus:bg-white focus:outline-none">
              <option value="All">All Districts</option>
              {DISTRICTS.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-highlands-900/10 bg-cream-50/50 p-12 text-center text-pine-600">
              <FileSpreadsheet className="mx-auto h-10 w-10 text-pine-600/30" />
              <p className="mt-3 text-sm font-medium">No projects yet.</p>
              <p className="mt-1 text-xs">Add your first project to organize maps, price lists, and computations.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {filtered.map((project) => {
                const isExpanded = expandedProject === project.id;
                return (
                  <div key={project.id} className="overflow-hidden rounded-2xl border border-highlands-900/10 bg-cream-50/40 transition-all hover:border-gold-500/30">
                    {/* Header Row */}
                    <div className="flex cursor-pointer items-center justify-between gap-3 p-4 sm:p-5" onClick={() => setExpandedProject(isExpanded ? null : project.id)}>
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
                            <span className={cn("rounded-full border px-2 py-0.5 font-bold uppercase", project.status === "Active" ? "border-highlands-600/30 bg-highlands-50 text-highlands-800" : "border-pine-600/20 bg-pine-50 text-pine-700")}>{project.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 text-[11px] text-pine-600 font-medium">
                          <span className="flex items-center gap-1"><Map className="h-3 w-3 text-gold-600" />{project.mapImages.length}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-gold-600" />{project.priceListImages.length}</span>
                          <span className="flex items-center gap-1"><Calculator className="h-3 w-3 text-gold-600" />{project.paymentTerms.length}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-pine-600" /> : <ChevronDown className="h-4 w-4 text-pine-600" />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-highlands-900/8 bg-white p-4 sm:p-6 space-y-6">
                        {/* Maps */}
                        {project.mapImages.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900"><Map className="h-3.5 w-3.5 text-gold-700" /> Site Maps ({project.mapImages.length})</h4>
                            <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3">
                              {project.mapImages.map((img, idx) => (
                                <a key={idx} href={img} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-xl border border-highlands-900/10 shadow-2xs hover:border-gold-500/40 hover:shadow-md transition-all">
                                  <img src={img} alt={`Map ${idx + 1}`} className="h-28 w-full object-cover sm:h-36" />
                                  <span className="absolute inset-0 flex items-center justify-center bg-highlands-950/0 opacity-0 transition-all group-hover:bg-highlands-950/40 group-hover:opacity-100">
                                    <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-highlands-900 shadow">View Full Map</span>
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price Lists */}
                        {project.priceListImages.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900"><DollarSign className="h-3.5 w-3.5 text-gold-700" /> Price Lists ({project.priceListImages.length})</h4>
                            <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3">
                              {project.priceListImages.map((img, idx) => (
                                <a key={idx} href={img} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-xl border border-highlands-900/10 shadow-2xs hover:border-gold-500/40 hover:shadow-md transition-all">
                                  <img src={img} alt={`Price ${idx + 1}`} className="h-28 w-full object-cover sm:h-36" />
                                  <span className="absolute inset-0 flex items-center justify-center bg-highlands-950/0 opacity-0 transition-all group-hover:bg-highlands-950/40 group-hover:opacity-100">
                                    <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-highlands-900 shadow">View Full Sheet</span>
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 border-t border-highlands-900/8 pt-4">
                          <button type="button" onClick={() => handleOpenEdit(project)} className="inline-flex items-center gap-1.5 rounded-lg border border-highlands-900/10 bg-cream-50 px-3 py-1.5 text-xs font-semibold text-highlands-900 hover:bg-cream-100">
                            <Edit2 className="h-3 w-3 text-gold-600" /> Edit
                          </button>
                          <button type="button" onClick={() => { if (window.confirm(`Delete "${project.name}"?`)) deleteProjectFile(project.id); }} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">
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
        </>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-highlands-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="animate-scale-in relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-highlands-900/10 bg-white p-6 shadow-2xl sm:p-8 text-highlands-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-highlands-900/8 pb-4">
              <h2 className="font-display text-xl font-normal">{editing ? `Edit: ${editing.name}` : "Add New Project"}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-cream-50 hover:bg-cream-100"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Project Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Primrose Parks" className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">District</label>
                  <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm font-medium focus:border-gold-500 focus:bg-white focus:outline-none">
                    {DISTRICTS.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProjectFile["category"] })} className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:bg-white focus:outline-none">
                    {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectFile["status"] })} className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:bg-white focus:outline-none">
                    {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Price Range</label>
                  <input type="text" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} placeholder="₱9M – ₱22M" className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-highlands-900 uppercase">Lot Sizes</label>
                  <input type="text" value={form.lotSizes} onChange={(e) => setForm({ ...form, lotSizes: e.target.value })} placeholder="400–900 sqm" className="mt-1.5 w-full rounded-xl border border-highlands-900/15 bg-cream-50/70 px-3 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none" />
                </div>
              </div>

              {/* Maps Upload */}
              <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900"><Map className="h-4 w-4 text-gold-700" /> Site Development Maps ({form.mapImages.length})</h4>
                {form.mapImages.length > 0 && (
                  <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
                    {form.mapImages.map((img, idx) => (
                      <div key={idx} className="group relative h-24 overflow-hidden rounded-xl border border-highlands-900/15 bg-white shadow-2xs">
                        <img src={img} alt={`Map ${idx + 1}`} className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setForm((prev) => ({ ...prev, mapImages: prev.mapImages.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white opacity-0 transition-opacity group-hover:opacity-100"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div onDragOver={(e) => { e.preventDefault(); setIsDraggingMap(true); }} onDragLeave={() => setIsDraggingMap(false)} onDrop={(e) => handleDrop(e, "map")} onClick={() => mapInputRef.current?.click()} className={cn("flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all", isDraggingMap ? "border-gold-500 bg-gold-50" : "border-highlands-900/15 bg-white hover:border-gold-500 hover:bg-cream-50")}>
                  <input type="file" ref={mapInputRef} multiple onChange={(e) => handleFileInput(e, "map")} accept="image/*" className="hidden" />
                  <Upload className="h-5 w-5 text-gold-700" />
                  <p className="mt-1 text-xs font-bold text-highlands-900">Drop map photos here, or click to attach</p>
                </div>
              </div>

              {/* Price Lists Upload */}
              <div className="rounded-2xl border border-highlands-900/10 bg-cream-50/70 p-4 space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-highlands-900"><DollarSign className="h-4 w-4 text-gold-700" /> Price List Sheets ({form.priceListImages.length})</h4>
                {form.priceListImages.length > 0 && (
                  <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
                    {form.priceListImages.map((img, idx) => (
                      <div key={idx} className="group relative h-24 overflow-hidden rounded-xl border border-highlands-900/15 bg-white shadow-2xs">
                        <img src={img} alt={`Price ${idx + 1}`} className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setForm((prev) => ({ ...prev, priceListImages: prev.priceListImages.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white opacity-0 transition-opacity group-hover:opacity-100"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div onDragOver={(e) => { e.preventDefault(); setIsDraggingPrice(true); }} onDragLeave={() => setIsDraggingPrice(false)} onDrop={(e) => handleDrop(e, "price")} onClick={() => priceInputRef.current?.click()} className={cn("flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all", isDraggingPrice ? "border-gold-500 bg-gold-50" : "border-highlands-900/15 bg-white hover:border-gold-500 hover:bg-cream-50")}>
                  <input type="file" ref={priceInputRef} multiple onChange={(e) => handleFileInput(e, "price")} accept="image/*" className="hidden" />
                  <Upload className="h-5 w-5 text-gold-700" />
                  <p className="mt-1 text-xs font-bold text-highlands-900">Drop price list photos here, or click to attach</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-highlands-900 uppercase">Project Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." className="mt-1.5 w-full resize-none rounded-xl border border-highlands-900/15 bg-cream-50/70 px-4 py-2.5 text-sm focus:border-gold-500 focus:bg-white focus:outline-none" />
              </div>

              <button type="submit" className="w-full rounded-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-3.5 text-sm font-semibold text-highlands-950 shadow-md transition-transform hover:-translate-y-0.5">
                <Check className="inline h-4 w-4 mr-1" />{editing ? "Save Changes" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
