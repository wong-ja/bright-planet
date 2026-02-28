import { MapPin, Info, Recycle, AlertCircle, Leaf, Target, AlertTriangle, BarChart3 } from "lucide-react";

export type DisposalCategory =
  | "recycle" 
  | "landfill" 
  | "compost" 
  | "ewaste" 
  | "hazardous" 
  | "unknown";

export interface Alternative {
  category: string;
  confidence: number;
  explanation: string;
}

export interface DisposalResultProps {
  material: string;
  category: DisposalCategory;
  explanation: string;
  reasoning?: string;
  tips?: string;
  confidence?: number;
  source?: string;
  mapQueryUrl?: string;
  alternatives?: Alternative[];
}

const categoryConfig = {
  recycle: { label: "Recyclable 🌿", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", icon: Recycle },
  landfill: { label: "Landfill 🗑️", color: "bg-slate-500/10 border-slate-500/30 text-slate-300", icon: null },
  compost: { label: "Compostable 🌱", color: "bg-lime-500/10 border-lime-500/30 text-lime-400", icon: Leaf },
  ewaste: { label: "E-Waste ⚡", color: "bg-sky-500/10 border-sky-500/30 text-sky-400", icon: null },
  hazardous: { label: "Hazardous ⚠️", color: "bg-red-500/10 border-red-500/30 text-red-400", icon: AlertCircle },
  unknown: { label: "Check Local Rules ❓", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300", icon: Info }
} as const;

export default function DisposalResult({ 
  material, 
  category, 
  explanation, 
  reasoning,
  tips,
  confidence,
  source,
  mapQueryUrl,
  alternatives = []
}: DisposalResultProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <section className="mt-8 rounded-3xl border p-8 shadow-2xl bg-linear-to-br from-slate-900/80 via-slate-900/50 to-slate-950 backdrop-blur-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">Detected</p>
          <h2 className="text-2xl font-black bg-linear-to-r from-slate-100 via-slate-50 to-slate-200 bg-clip-text text-transparent">
            {material}
          </h2>
        </div>
      {/* confidence % */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-slate-900/50 border border-slate-700">
        {confidence !== undefined && (
          <div className="flex items-center gap-2 text-xs">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-400">Confidence:</span>
            <div className="ml-auto w-16 bg-linear-to-r from-emerald-500/20 to-blue-500/20 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-emerald-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="font-mono text-slate-300">{Math.round(confidence * 100)}%</span>
          </div>
        )}
        
        {source && (
          <div className="flex items-center gap-2 text-xs text-slate-400 justify-end">
            <span>via</span>
            <span className="font-mono bg-slate-800 px-2 py-1 rounded text-slate-500">{source}</span>
          </div>
        )}
      </div>
        <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 border-2 font-bold text-sm ${config.color}`}>
          {Icon && <Icon className="h-4 w-4" />}
          {config.label}
        </div>
      </div>


      {/* main analysis */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mt-0.5 shrink-0">
            <Recycle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 mb-1">How to Dispose</h3>
            <p className="text-sm text-slate-300">{explanation}</p>
          </div>
        </div>

        {reasoning && (
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30">
            <Target className="h-6 w-6 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-slate-300 leading-relaxed">{reasoning}</p>
            </div>
          </div>
        )}

        {tips && (
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <AlertTriangle className="h-6 w-6 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-slate-300 leading-relaxed">{tips}</p>
            </div>
          </div>
        )}
      </div>


      {/* TOP 3 ALTERNATIVES */}
      {alternatives.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-linear-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/20">
          <p className="text-s font-semibold uppercase tracking-wider text-emerald-400 mb-2">Alternative Detections</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map((alt, index) => (
              <div key={index} className="group p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-200">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/30">
                      <span className="text-blue-400 font-bold text-lg">{index + 2}</span>
                    </div>
                    <p className="font-bold text-slate-200 capitalize text-base flex-1 min-w-0">{alt.category}</p>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">{alt.explanation}</p>
                  <div className="flex flex-col items-end gap-1 mt-auto">
                    <div className="w-20 bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all group-hover:from-blue-500 group-hover:to-blue-700"
                        style={{ width: `${alt.confidence * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-slate-300 group-hover:text-blue-300 mt-1">
                      {Math.round(alt.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* MAP link */}
      {mapQueryUrl && (
        <a
          href={mapQueryUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 font-bold text-black shadow-2xl hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all duration-200 border border-emerald-500/50 w-full justify-center"
        >
          <MapPin className="h-5 w-5 group-hover:animate-pulse" />
          <span>Find Nearby Drop-Offs</span>
          <div className="ml-auto w-2 h-2 rounded-full bg-white/80 group-hover:bg-white animate-ping" />
        </a>
      )}

      <p className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
        Local rules vary. Always check your municipality&apos;s guidelines.
      </p>
    </section>
  );
}
