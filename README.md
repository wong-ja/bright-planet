# Bright Planet

Scan waste items. Get disposal instructions. Find nearby drop-offs. Cross-platform PWA for responsible recycling.

## Features

- Image upload + barcode scanner
- Computer vision image classification (eg. plastic, food, paper, etc.)
- Location-aware drop-off finder
- Fully responsive PWA
- Dark UI

## Tech Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS + Lucide React  

- **Backend:** Python FastAPI + Computer Vision (PIL, NumPy)  

- **Scanner:** @yudiel/react-qr-scanner  

- **Deployment:** Vercel, Render


## Setup & Install

1. Clone & install
```
git clone https://github.com/wong-ja/bright-planet
cd bright-planet
npm install
```

Add `.env`
```
PYTHON_API_URL=http://localhost:8000
```

2. Start frontend
```
npm run dev
```

3. Start backend
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```


## Usage
1. Upload photo or scan barcode
2. Get instant material classification + disposal method
3. Click "Find Nearby Drop-Offs" (enable location for best results)
