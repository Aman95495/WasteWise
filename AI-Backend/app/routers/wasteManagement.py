from fastapi import APIRouter, HTTPException, UploadFile, File
import base64
import requests
import io
from PIL import Image
import logging
import os
from dotenv import load_dotenv
import re

router = APIRouter(prefix="/waste", tags=["waste"])

load_dotenv()
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY_MEDICAL")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY_WASTE is not set in the .env file")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WASTE_KEYWORDS = [
    "recyclable", "biodegradable", "hazardous", "e-waste",
    "dispose", "compost", "landfill", "recycle",
    "plastic", "metal", "paper", "glass",
    "organic", "chemical", "electronic", "safety"
]

def clean_waste_response(text: str) -> str:
    """Clean and format the waste classification response"""
    replacements = {
        "I'm sorry": "Please note",
        "I cannot": "This image doesn't clearly show",
        "I'm not sure": "Please ensure the image clearly shows the waste item",
        "you should": "Recommended action:"
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def is_waste_response(text: str) -> bool:
    """Validate if the response contains waste management content"""
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in WASTE_KEYWORDS)

def prepare_messages(encoded_image: str):
    """Prepare the messages payload for waste classification"""
    waste_prompt = (
        "You are a professional waste management specialist. Analyze this image carefully and provide:\n"
        "1. Waste type classification (recyclable/biodegradable/hazardous/e-waste/plastic etc.)\n"
        "2. Detailed disposal instructions\n"
        "3. Recycling tips if applicable\n"
        "4. Environmental impact notes\n"
        "5. Safety precautions if hazardous\n\n"
        "Structure response in this format:\n"
        "Classification: [Type]\n"
        "Material: [Primary material]\n"
        "Disposal: [Step-by-step instructions]\n"
        "Recycling: [Options]\n"
        "Safety: [Precautions]\n"
        "Environmental: [Impact notes]"
    )

    content = [{
        "type": "text",
        "text": waste_prompt
    }, {
        "type": "image_url",
        "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}
    }]

    return [{"role": "user", "content": content}]

def parse_structured_response(cleaned_answer):
    response_dict = {}
    current_section = None

    for line in cleaned_answer.split('\n'):
        line = line.strip()
        # Match lines like **Classification:** or Classification:
        match = re.match(r"\*{0,2}([\w\s]+)\*{0,2}:\s*(.*)", line)
        if match:
            section = match.group(1).strip().lower()
            content = match.group(2).strip()
            current_section = section
            response_dict[current_section] = content
        elif current_section:
            # Continue appending to the current section
            response_dict[current_section] += ' ' + line

    return {
        "classification": response_dict.get("classification", "Unknown"),
        "material": response_dict.get("material", "Unspecified"),
        "disposal": response_dict.get("disposal", "No disposal instructions"),
        "recycling": response_dict.get("recycling", "No recycling information"),
        "safety": response_dict.get("safety", "No safety precautions"),
        "environmental": response_dict.get("environmental", "No environmental impact notes")
    }

@router.post("/classify")
async def waste_classification(image: UploadFile = File(...)):
    try:
        # Process image
        image_content = await image.read()
        if not image_content:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        # Verify and encode image
        img = Image.open(io.BytesIO(image_content))
        img.verify()
        encoded_image = base64.b64encode(image_content).decode("utf-8")
        logger.info("Image processed successfully")

        # Use best vision model available
        vision_model = "llama-3.2-90b-vision-preview"  # Update with latest Groq vision model
        messages = prepare_messages(encoded_image)

        response = requests.post(
            GROQ_API_URL,
            json={
                "model": vision_model,
                "messages": messages,
                "max_tokens": 1000,
                "temperature": 0.2,
                "top_p": 0.9
            },
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            timeout=45
        )
        response.raise_for_status()
        
        # Process response
        result = response.json()
        raw_answer = result["choices"][0]["message"]["content"]
        
        # Validate and clean response
        if not is_waste_response(raw_answer):
            raise HTTPException(
                status_code=400,
                detail="Invalid response from AI model"
            )
            
        cleaned_answer = clean_waste_response(raw_answer)
        
        return parse_structured_response(cleaned_answer)

    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Classification failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Waste classification failed: {str(e)}"
        )