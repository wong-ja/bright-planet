import { MapPin, Info, Recycle, AlertCircle, Leaf } from "lucide-react";

export type DisposalCategory =
  | "recycle" | "landfill" | "compost" 
  | "ewaste" | "hazardous" | "unknown";

export interface DisposalResultProps {
  material: string;
  category: DisposalCategory;
  explanation: string;
  mapQueryUrl?: string;
}

const categoryConfig = {
  recycle: { label: "Recyclable 🌿", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", icon: Recycle },
  landfill: { label: "Landfill 🗑️", color: "bg-slate-500/10 border-slate-500/30 text-slate-300", icon: null },
  compost: { label: "Compostable 🌱", color: "bg-lime-500/10 border-lime-500/30 text-lime-400", icon: Leaf },
  ewaste: { label: "E-Waste ⚡", color: "bg-sky-500/10 border-sky-500/30 text-sky-400", icon: null },
  hazardous: { label: "Hazardous ⚠️", color: "bg-red-500/10 border-red-500/30 text-red-400", icon: AlertCircle },
  unknown: { label: "Check Local Rules ❓", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300", icon: Info }
} as const;

export default function DisposalResult({ material, category, explanation, mapQueryUrl }: DisposalResultProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <section className="mt-8 rounded-3xl border p-8 shadow-2xl bg-linear-to-br from-slate-900/80 via-slate-900/50 to-planet-950 backdrop-blur-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">Detected</p>
          <h2 className="text-2xl font-black bg-linear-to-r from-slate-100 via-slate-50 to-slate-200 bg-clip-text text-transparent">
            {material}
          </h2>
        </div>
        <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 border-2 font-bold text-sm ${config.color}`}>
          {Icon && <Icon className="h-4 w-4" />}
          {config.label}
        </div>
      </div>

      <div className="flex items-start gap-4 mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
        <Info className="h-6 w-6 text-primary mt-0.5 shrink-0" />
        <p className="text-sm leading-relaxed text-slate-200">{explanation}</p>
      </div>

      {mapQueryUrl && (
        <a
          href={mapQueryUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 font-bold text-black shadow-2xl hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200 border border-primary/50"
        >
          <MapPin className="h-5 w-5 group-hover:animate-pulse" />
          <span>Find Nearby Drop-Offs</span>
          <div className="ml-auto w-2 h-2 rounded-full bg-white/80 group-hover:bg-white animate-ping" />
        </a>
      )}

      <p className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
        Local rules vary. When in doubt, check your city&apos;s recycling guidelines.
      </p>
    </section>
  );
}
