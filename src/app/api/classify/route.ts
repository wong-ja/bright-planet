import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL =
  process.env.PYTHON_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const barcode = formData.get("barcode") as string | null;

    if (!file && !barcode) {
      return NextResponse.json(
        { error: "Either image file or barcode required" },
        { status: 400 }
      );
    }

    const forwardData = new FormData();

    if (file) {
      forwardData.append("file", file, file.name || "upload");
    }

    if (barcode) {
      forwardData.append("barcode", barcode);
    }

    const lat = formData.get("lat") as string | null;
    const lng = formData.get("lng") as string | null;

    if (lat) forwardData.append("lat", lat);
    if (lng) forwardData.append("lng", lng);

    const res = await fetch(`${PYTHON_API_URL}/api/classify`, {
      method: "POST",
      body: forwardData,
      // Do NOT set Content-Type; fetch will set it
    });

    if (!res.ok) {
      console.error("Python API error:", await res.text());
      return NextResponse.json(
        { error: "Classification service temporarily unavailable" },
        { status: 503 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API route error:", err);
    console.error("Error stack:", (err as Error).stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
