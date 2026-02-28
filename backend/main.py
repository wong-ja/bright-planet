from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageEnhance, ImageFilter
import io
import numpy as np
from typing import Optional, Dict, List

app = FastAPI(title="Bright Planet Waste API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DETAILED_RULES = {
    "plastic": {
        "category": "recycle",
        "method": "Single-stream recycling bin",
        "reasoning": "Bright smooth plastic (PET/HDPE) bottle/container", 
        "tips": "Rinse thoroughly, crush bottles, recycle cap separately",
        "confidence": 0.92
    },
    "glass": {
        "category": "recycle",
        "method": "Glass recycling bin",
        "reasoning": "Transparent/reflective glass bottle or jar", 
        "tips": "Remove metal lid/ring separately, no Pyrex/windows",
        "confidence": 0.88
    },
    "metal": {
        "category": "recycle",
        "method": "Metal can recycling", 
        "reasoning": "Shiny aluminum/steel can (soda/beer/food)",
        "tips": "Rinse clean, DON'T crush aluminum cans",
        "confidence": 0.90
    },
    "paper": {
        "category": "recycle",
        "method": "Paper recycling bin",
        "reasoning": "Office paper, newspaper, clean magazines", 
        "tips": "Must be completely clean/dry, no tape",
        "confidence": 0.85
    },
    "cardboard": {
        "category": "recycle",
        "method": "Cardboard recycling", 
        "reasoning": "Corrugated brown cardboard box/packaging",
        "tips": "Flatten completely, remove all tape/food residue",
        "confidence": 0.87
    },
    "food": {
        "category": "compost",
        "method": "Compost bin", 
        "reasoning": "Food scraps (fruit peels, veg scraps, coffee grounds)",
        "tips": "No meat/dairy/oil, bury in compost to reduce odor",
        "confidence": 0.82
    },
    "organic": {
        "category": "compost",
        "method": "Compost bin",
        "reasoning": "Plant matter, yard waste, soil, fresh produce", 
        "tips": "Perfect for backyard compost, mix with dry leaves",
        "confidence": 0.85
    },
    "battery": {
        "category": "hazardous",
        "method": "Battery recycling drop-off",
        "reasoning": "AA/AAA/rechargeable battery (cylindrical + metallic)",
        "tips": "Tape both terminals, Home Depot/Best Buy/Staples",
        "confidence": 0.95
    },
    "electronics": {
        "category": "ewaste",
        "method": "E-waste facility",
        "reasoning": "Phone cables chargers circuit boards",
        "tips": "Factory reset/wipe data first, certified recycler only",
        "confidence": 0.93
    },
    "unknown": {
        "category": "unknown",
        "method": "Check local guidelines",
        "reasoning": "Insufficient visual characteristics identified",
        "tips": "Look for #1-7 recycling symbols, call waste authority",
        "confidence": 0.40
    }
}

def analyze_image_vision_detailed(image: Image.Image) -> Dict:
    """Primary + top 3 alternatives with confidence scores"""
    image = image.convert('RGB').resize((224, 224))
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.4)
    
    img_array = np.array(image).astype(np.float32) / 255.0
    r, g, b = [np.mean(img_array[:,:,i]) for i in range(3)]
    brightness = np.mean([r, g, b])
    
    # texture analysis
    texture = np.mean([np.var(img_array[:,:,i]) for i in range(3)])
    greenness = g / max(brightness, 0.05)
    
    # edge detection (shapes)
    edges = image.filter(ImageFilter.FIND_EDGES)
    edge_array = np.array(edges)
    edge_density = np.sum(edge_array > 120) / (224 * 224)
    
    print(f"📊 Analysis: B={brightness:.2f} G={greenness:.2f} T={texture:.04f} E={edge_density:.3f}")
    
    # SCORE ALL CATEGORIES
    scores = {
        'organic': 0.1 + greenness * 0.9 + (1-brightness) * 0.3,
        'food': 0.1 + greenness * 0.7 + texture * 0.2,
        'plastic': 0.2 + (brightness > 0.8) * 0.6 + (texture < 0.03) * 0.1,
        'glass': 0.1 + (brightness > 0.85) * 0.7 + (r > 0.75) * 0.1,
        'metal': 0.1 + (r > 0.7) * 0.7 + (g < 0.5) * 0.2,
        'paper': 0.1 + (0.6 < brightness < 0.75) * 0.6 + texture * 0.2,
        'cardboard': 0.1 + (0.45 < brightness < 0.65) * 0.6 + texture * 0.2,
        'electronics': 0.1 + (brightness < 0.45) * 0.7 + edge_density * 0.2,
        'battery': 0.1 + edge_density * 0.6 + (brightness > 0.5) * 0.2,
    }
    
    total = sum(scores.values())
    for k in scores:
        scores[k] = scores[k] / max(total, 1.0)
    
    sorted_scores = dict(sorted(scores.items(), key=lambda x: x[1], reverse=True))
    primary = list(sorted_scores.keys())[0]
    
    alternatives = []
    for cat, conf in list(sorted_scores.items())[1:4]:
        if conf > 0.05:
            alternatives.append({
                "category": cat, 
                "confidence": round(conf, 2),
                "explanation": DETAILED_RULES[cat]["reasoning"]
            })
    
    print(f"🎯 Primary: {primary} ({scores[primary]:.0%})")
    print(f"   Alts: {alternatives}")
    
    return {
        "primary": primary,
        "confidence": scores[primary],
        "alternatives": alternatives
    }

@app.post("/api/classify")
async def classify(file: UploadFile = File(None), barcode: Optional[str] = Form(None), lat: Optional[str] = Form(None), lng: Optional[str] = Form(None)):
    try:
        if file:
            contents = await file.read()
            if len(contents) == 0:
                raise HTTPException(400, "Empty file")
            
            image = Image.open(io.BytesIO(contents))
            analysis = analyze_image_vision_detailed(image)
            primary = analysis["primary"]
            rules = DETAILED_RULES.get(primary, DETAILED_RULES["unknown"])
            
            return {
                "material": f"{primary.title()} item",
                "category": rules["category"],
                "explanation": rules["method"],
                "reasoning": rules["reasoning"],
                "tips": rules["tips"],
                "confidence": analysis["confidence"],
                "source": "Computer Vision Analysis",
                "alternatives": analysis["alternatives"],
                "mapQuery": lat and f"{rules['category']}+drop+off+near+{lat},{lng}"
            }
        elif barcode:
            return {
                "material": f"Product {barcode[:12]}",
                "category": "recycle",
                "explanation": "Single-stream recycling", 
                "reasoning": "Most products use recyclable packaging",
                "tips": "Check for #1-7 recycling symbols",
                "confidence": 0.75,
                "source": "Barcode scan",
                "alternatives": [],
                "mapQuery": lat and f"recycling+near+{lat},{lng}"
            }
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(400, f"Analysis failed: {str(e)}")

@app.get("/")
def root():
    return {"status": "Bright Planet API - Live ✅"}