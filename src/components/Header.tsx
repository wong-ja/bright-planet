"use client";
import Link from "next/link";
import { Globe, Camera, BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-800/50 bg-planet-950/95 backdrop-blur-xl sticky top-0 z-50 supports-[backdrop-filter:blur()]:bg-planet-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3 overflow-hidden rounded-xl p-2 transition-all hover:bg-slate-900/50">
          <div className="relative">
            <Globe className="h-10 w-10 text-primary group-hover:animate-pulse-glow group-hover:scale-110 transition-all duration-300" />
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-2xl blur-xl opacity-30 animate-pulse-glow group-hover:opacity-50" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-linear-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
              Bright Planet
            </h1>
            <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">Smart Waste Sorting</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link 
            href="/learn" 
            className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900/50 hover:text-slate-100 transition-all duration-200 border border-slate-800/50 hover:border-primary/50"
          >
            <BookOpen className="h-4 w-4" />
            Quick Guide
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-slate-400 font-medium bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <Link 
              href="/"
              className=" inline-flex items-center gap-3 bg-transparent text-emerald-500 text-base scale-90 font-medium hover:text-emerald-200 hover:shadow-primary/25 transition-all">
              <Camera className="h-4 w-4 text-primary" />
              Start Scanning
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
