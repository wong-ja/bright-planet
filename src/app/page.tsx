"use client";
import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import DisposalResult, { DisposalCategory } from "@/components/DisposalResult";
import BarcodeScanner from "@/components/BarcodeScanner";
import { Camera, ImageIcon, LocateFixed, Loader2, Barcode, X, Globe, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ClassificationResponse {
  material: string;
  category: DisposalCategory;
  explanation: string;
  reasoning?: string;
  tips?: string;
  confidence?: number;
  source?: string;
  mapQueryUrl?: string | null;
  alternatives?: Array<{
    category: string;
    confidence: number;
    explanation: string;
  }>;
}

export default function HomePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleUseCamera = () => fileInputRef.current?.click();

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location access denied. Disposal guidance still available.")
    );
  };

  const handleBarcodeScan = async (code: string) => {
    setShowBarcodeScanner(false);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("barcode", code);
      if (coords) {
        formData.append("lat", String(coords.lat));
        formData.append("lng", String(coords.lng));
      }

      const res = await fetch("/api/classify", {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type; fetch handles it
      });

      if (!res.ok) throw new Error("Classification service unavailable");
      const data = await res.json() as ClassificationResponse;
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Barcode lookup failed. Try image scan instead.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select/take a photo first.");
      return;
    }

    console.log("📁 File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });
    const formData = new FormData();
    formData.append("file", file);
    
    for (const [key, value] of formData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (coords) {
        formData.append("lat", String(coords.lat));
        formData.append("lng", String(coords.lng));
      }

      const res = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image analysis failed");
      const data = await res.json() as ClassificationResponse;
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col gradient-planet">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-linear-to-r from-primary/20 to-emerald-500/20 px-6 py-3 rounded-3xl border border-primary/30 mb-8">
            <Globe className="h-6 w-6 text-primary animate-float" />
            <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-slate-100 via-white to-slate-200 bg-clip-text text-transparent drop-shadow-2xl">
              Bright Planet
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Scan any item. Get instant disposal instructions. Find nearby drop-offs. 
            <span className="text-primary font-bold"> Save the planet.</span>
          </p>
        </section>

        {/* scanner */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="rounded-4xl border-2 border-slate-800/50 bg-slate-900/50 backdrop-blur-xl p-10 shadow-2xl hover:border-primary/50 transition-all duration-300 group">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview!}
                      alt="Item preview"
                      width={800}
                      height={384}
                      className="w-full h-96 rounded-3xl object-cover shadow-2xl group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute right-6 top-6 p-3 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-slate-800 hover:bg-slate-900 shadow-2xl transition-all"
                      title="Remove image"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 rounded-3xl border-2 border-dashed border-slate-700/50 bg-linear-to-b from-slate-900/30 to-planet-950 text-slate-400 group-hover:border-primary/50 transition-all">
                    <ImageIcon className="h-24 w-24 mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-2xl font-bold mb-3 text-slate-300">Scan Your Item</h3>
                    <p className="text-sm max-w-md text-center mb-12 opacity-75">
                      Take a photo of packaging, containers, or electronics
                    </p>
                  </div>
                )}
              </div>

              {/* buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleUseCamera}
                  className="flex-1 flex items-center justify-center gap-3 rounded-3xl bg-linear-to-r from-slate-700 to-slate-800 px-8 py-5 text-base font-bold text-slate-100 border-2 border-slate-700/50 hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200"
                >
                  <Camera className="h-6 w-6" />
                  Upload Image
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => setShowBarcodeScanner(true)}
                  className="flex-1 flex items-center justify-center gap-3 rounded-3xl bg-linear-to-r from-emerald-500 to-emerald-600 px-8 py-5 text-lg font-bold text-black border-2 border-emerald-700/50 hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200"
                >
                  <Barcode className="h-6 w-6 -rotate-12" />
                  Scan Barcode
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border-2 border-slate-800/50 bg-slate-900/50 p-8 backdrop-blur-xl hover:border-primary/50 transition-all shadow-xl">
                <button
                  type="button"
                  onClick={requestLocation}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-slate-800 to-slate-900 px-6 py-4 border border-slate-700/50 hover:border-primary hover:shadow-lg transition-all font-semibold text-slate-100"
                >
                  <LocateFixed className="h-5 w-5 text-primary" />
                  Use My Location
                </button>
                
                {coords && (
                  <p className="mt-4 text-xs text-emerald-400 text-center font-medium animate-pulse">
                    ✅ Location ready
                  </p>
                )}
                
                <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
                  Location helps find nearby recycling centers and special drop-offs (e-waste, hazardous, compost).
                </p>

                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full mt-6 bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-5 text-lg font-semibold text-black rounded-2xl hover:shadow-primary/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Analyzing Item...
                    </>
                  ) : (
                    "💡 Analyze"
                  )}
                </button>

                {error && (
                  <div className="mt-6 p-8 rounded-3xl border-2 border-red-500/20 bg-red-500/5 backdrop-blur-xl text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-red-300">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* result */}
        {result && (
          <DisposalResult
            material={result.material}
            category={result.category}
            explanation={result.explanation}
            reasoning={result.reasoning}
            tips={result.tips}
            confidence={result.confidence}
            source={result.source}
            mapQueryUrl={result.mapQueryUrl ?? undefined}
            alternatives={result.alternatives || []}
          />
        )}

        {/* barcode scan */}
        {showBarcodeScanner && (
          <BarcodeScanner
            onCodeDetected={handleBarcodeScan}
            onClose={() => setShowBarcodeScanner(false)}
          />
        )}
      </main>
    </div>
  );
}
