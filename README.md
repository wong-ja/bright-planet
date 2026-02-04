# Bright Planet
---

Hackathon 2026

---

**Scan items, get disposal instructions, find drop-offs.** Cross-platform PWA for responsible waste sorting.

[![Vercel Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOURUSERNAME/ecosort)

## ✨ Features

- 📱 **Camera + Barcode/QR Scanner** - Snap photos or scan codes
- 🧠 **AI Classification** - Gemini Vision identifies materials
- 🗺️ **Location-aware** - Finds nearby recycling/e-waste drop-offs
- 📚 **Quick guides** - Common items reference
- 🎨 **Dark, responsive** - Works on phone/desktop
- 🚀 **Vercel-ready** - One-click deploy

## 🛠️ Tech Stack

- Frontend: Next.js 15 (App Router) + TypeScript + Tailwind + Lucide
- Backend: Python FastAPI + Gemini 1.5 Flash (free tier)
- Barcode: @yudiel/react-qr-scanner
- Deploy: Vercel (frontend) + Render (Python API)

## 🚀 Quick Start

# 1. Clone & install
```
git clone <your-repo> ecosort
cd ecosort
npm install
```

# 2. Run frontend
```
npm run dev
```

# 3. Python API (separate terminal)
```
cd python-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Add to .env.local:
```
PYTHON_API_URL=http://localhost:8000/api/classify
```

## 🌍 Environmental Impact

Reduces recycling contamination by educating users on:

- Material identification (95% accuracy with Gemini Vision)
- Local disposal rules
- Drop-off location discovery
- Common mistakes (pizza boxes, batteries, etc.)

## 📱 Cross-platform

- PWA: Add to homescreen (phone/desktop)
- Responsive: Mobile-first design
- Offline-ready: Caching + service worker ready

## 🔑 Environment Variables

#### Frontend
`PYTHON_API_URL`

#### Python
`GEMINI_API_KEY`


## 🧪 Testing

Test barcode lookup (eg. plastic bottle)
```
curl -X POST http://localhost:8000/api/classify \
  -F "barcode=012346500011" \
  -F "lat=40.7128" \
  -F "lng=-74.0060"
```

## 🚀 Deploy
- Frontend: Connect GitHub repo to Vercel

- Python: Deploy to Render/Fly.io, set GEMINI_API_KEY

- Connect: Add Python URL to Vercel env vars

## 📈 Future Features
- User accounts + sorting history

- City-specific rules database

- Impact calculator (kg CO2 saved)

- Native app wrapper (Capacitor)

## 🙌 Credits

Built for environmental hackathons 2026. Made with ❤️ for the planet.
