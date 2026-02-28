import { NextRequest, NextResponse } from "next/server";

interface WasteClassification {
  material: string;
  category: string;
  explanation: string;
  reasoning: string;
  tips: string;
  confidence: number;
  source: string;
  mapQuery: string | null;
  alternatives?: Array<{ category: string; confidence: number; explanation: string }>;
}

const BACKEND_URL = "http://localhost:8000/api/classify";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const barcode = formData.get("barcode") as string | null;
    const lat = formData.get("lat") as string | null;
    const lng = formData.get("lng") as string | null;

    if (!file && !barcode) {
      return NextResponse.json({ error: "Image or barcode required" }, { status: 400 });
    }

    const backendFormData = new FormData();
    if (file) backendFormData.append("file", file);
    if (barcode) backendFormData.append("barcode", barcode);
    if (lat) backendFormData.append("lat", lat);
    if (lng) backendFormData.append("lng", lng);

    const res = await fetch(BACKEND_URL, { 
      method: "POST", 
      body: backendFormData 
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      return NextResponse.json({ error: "Backend service failed" }, { status: 500 });
    }

    const data = await res.json() as WasteClassification;

    return NextResponse.json({
      material: data.material,
      category: data.category,
      explanation: data.explanation,
      reasoning: data.reasoning,
      tips: data.tips,
      confidence: data.confidence,
      source: data.source,
      mapQueryUrl: data.mapQuery
        ? `https://www.google.com/maps/search/${encodeURIComponent(data.mapQuery)}`
        : null,
      alternatives: data.alternatives || [],
    });
  } catch (err) {
    console.error("Critical error:", err);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}
