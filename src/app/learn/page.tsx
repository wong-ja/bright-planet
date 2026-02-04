import Header from "@/components/Header";
import Link from "next/link";
import { Leaf, Recycle, AlertTriangle, Battery, Trash2 } from "lucide-react";

const guides = [
  {
    icon: "🍾",
    title: "Plastic Bottles",
    category: "recycle",
    content: "Rinse thoroughly. Remove cap (recycle separately). #1 PET plastic accepted by most curbside programs.",
    color: "emerald"
  },
  {
    icon: "🔋", 
    title: "Batteries",
    category: "hazardous",
    content: "Take to battery recycling (Home Depot, Best Buy). NEVER trash. Hazardous materials.",
    color: "red"
  },
  {
    icon: "🍕",
    title: "Pizza Boxes", 
    category: "landfill",
    content: "Grease contaminates recycling. Scrape food, tear clean parts if possible.",
    color: "slate"
  },
  {
    icon: "🥣",
    title: "Aluminum Foil",
    category: "recycle", 
    content: "Clean + crinkle into loose ball. Most curbside programs accept clean aluminum.",
    color: "emerald"
  }
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-planet-950 via-slate-950 to-slate-900">
      <Header />
      
      <main className="mx-auto max-w-6xl px-6 py-24">
        <section className="text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-black bg-linear-to-r from-emerald-400 via-primary to-teal-400 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            Quick Guides
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Common items cheat sheet. Scan for specifics or check these rules first.
          </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide, index) => (
            <div 
              key={guide.title}
              className="group rounded-4xl border-2 border-slate-800/50 p-10 bg-linear-to-b from-slate-900/50 to-planet-950/70 backdrop-blur-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl shrink-0">{guide.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      guide.category === 'recycle' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      guide.category === 'hazardous' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    } border`}>
                      {guide.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Most cities</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-100 group-hover:text-primary transition-colors mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {guide.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-24 text-center">
          <div className="max-w-2xl mx-auto p-10 rounded-4xl bg-linear-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 backdrop-blur-xl">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-yellow-100 mb-4">Local Rules Matter</h3>
            <p className="text-lg text-yellow-200 leading-relaxed">
              Recycling rules vary by city and neighborhood. These are general guidelines. 
              Always check your local guidelines when in doubt.
            </p>
          </div>
        </section>

        <div className="mt-24 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-linear-to-r from-primary to-emerald-600 text-black font-black px-12 py-6 rounded-4xl text-xl shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
          >
            ✨ Start Scanning
          </Link>
        </div>
      </main>
    </div>
  );
}
