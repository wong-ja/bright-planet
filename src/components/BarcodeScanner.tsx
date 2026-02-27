"use client";
import { useState, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Barcode, X, CameraOff } from "lucide-react";

interface BarcodeScannerProps {
  onCodeDetected: (code: string) => void;
  onClose: () => void;
}

interface DetectedCode {
  rawValue: string;
}

export default function BarcodeScanner({ onCodeDetected, onClose }: BarcodeScannerProps) {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState("");

  const handleScan = useCallback((detectedCodes: DetectedCode[]) => {
    if (detectedCodes.length > 0 && !scanned) {
      const code = detectedCodes[0].rawValue;
      setScanned(true);
      onCodeDetected(code);
    }
  }, [onCodeDetected, scanned]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-lg rounded-3xl bg-linear-to-b from-planet-950 to-slate-900/95 border border-slate-800/50 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-emerald-400 to-emerald-500 rounded-2xl">
                <Barcode className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black bg-linear-to-r from-slate-200 to-slate-100 bg-clip-text text-transparent">
                  Scan Code
                </h2>
                <p className="text-sm text-emerald-400 font-medium">Barcode or QR Code</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl hover:bg-slate-800/50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CameraOff className="h-16 w-16 text-slate-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">Camera Access Needed</h3>
              <p className="text-slate-500 mb-6 max-w-sm">Allow camera permissions to scan barcodes and QR codes</p>
              <button
                onClick={() => { 
                  setError(""); 
                  setScanned(false); 
                }}
                className="px-6 py-3 bg-primary text-black font-bold rounded-2xl hover:bg-emerald-600 transition-all"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <div className="h-80 rounded-2xl border-4 border-dashed border-primary/30 bg-linear-to-b from-slate-900/50 to-planet-950 overflow-hidden">
              <Scanner
                onScan={handleScan}
                constraints={{ facingMode: "environment" }}
                paused={scanned}
                scanDelay={500}
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800/50 bg-slate-900/50 rounded-b-3xl">
          <p className="text-xs text-slate-500 text-center">
            Point at any barcode, QR code, or product label
          </p>
        </div>
      </div>
    </div>
  );
}
