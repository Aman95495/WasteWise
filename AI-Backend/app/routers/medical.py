from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import base64
import requests
import io
from PIL import Image
import logging
import os
from dotenv import load_dotenv

router = APIRouter(prefix="/medical", tags=["medical"])

load_dotenv()
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY_MEDICAL")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in the .env file")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Medical keywords to validate responses
MEDICAL_KEYWORDS = [
    "symptom", "diagnos", "condition", "medical", "doctor",
    "treat", "prescribe", "rash", "pain", "infection",
    "disease", "illness", "clinical", "health", "patient"
]

def clean_medical_response(text: str) -> str:
    """Clean and format the medical response"""
    replacements = {
        "I'm sorry": "Please note",
        "I cannot": "This image doesn't clearly show",
        "I'm not a doctor": "Consult a healthcare professional",
        "you should see a doctor": "medical evaluation is recommended"
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def is_medical_response(text: str) -> bool:
    """Validate if the response contains medical content"""
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in MEDICAL_KEYWORDS)

def prepare_messages(text_input: Optional[str], encoded_image: Optional[str], supports_vision: bool):
    """Prepare the messages payload based on model capabilities"""
    if supports_vision and encoded_image:
        medical_prompt = (
                "You are a professional medical assistant and need to Analyze this medical image carefully and provide:\n"
                "1. Focus strictly on medical observations\n"
                "2. Never identify people or make non-medical comments\n"
                "3. Include notes about consulting healthcare professionals\n"
                "4. Use clear, professional medical language\n"
                "Focus ONLY on medical aspects. Do NOT describe:\n"
                "- Personal appearance\n"
                "- Clothing\n"
                "- Non-medical environmental details\n\n"
                "IMPORTANT: Describe ONLY medical findings. Never mention clothing, appearance, or non-medical details."
        )
            
        content = []
        if text_input:
                content.append({"type": "text", "text": f"MEDICAL CONTEXT: {text_input}\n\n{medical_prompt}"})
        else:
                content.append({"type": "text", "text": medical_prompt})
                
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}
        })
                            
        return [{"role": "user", "content": content}]    
    else:
        # For text-only models - include system message
        system_msg = {
            "role": "system",
            "content": (
                "You are a professional medical assistant. Your responses must:\n"
                "1. Focus strictly on medical observations\n"
                "2. Never identify people or make non-medical comments\n"
                "3. Include disclaimers about consulting healthcare professionals\n"
                "4. Use clear, professional medical language"
            )
        }
        content = text_input if text_input else (
            "Please provide a text description of the medical condition or query. "
            "This model doesn't support image analysis."
        )
        return [system_msg, {"role": "user", "content": content}]

@router.post("/analyze")
async def medical_analysis(
    image: Optional[UploadFile] = File(None),
    query: Optional[str] = Form(None)
):
    try:
        # Validate at least one input is provided
        if image is None and query is None:
            raise HTTPException(
                status_code=400,
                detail="Either image or text query must be provided"
            )

        # Process text input
        text_input = query.strip() if query else None

        # Process image if provided
        encoded_image = None
        if image:
            try:
                image_content = await image.read()
                if not image_content:
                    raise HTTPException(status_code=400, detail="Empty image file")
                
                # Verify it's a valid image
                img = Image.open(io.BytesIO(image_content))
                img.verify()
                
                # Encode image
                encoded_image = base64.b64encode(image_content).decode("utf-8")
                logger.info("Image successfully processed and encoded")
            except Exception as e:
                logger.error(f"Invalid image format: {str(e)}")
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid image format: {str(e)}"
                )

        # Define models and their capabilities
        models = [
            ("llama", "llama-3.2-11b-vision-preview", True),  # Vision-capable
            ("llava", "llama-3.2-90b-vision-preview", True),  # Vision-capable
            ("qwen", "qwen-2.5-32b", False)                  # Text-only
        ]

        responses = {}
        for model_name, model, supports_vision in models:
            try:
                # Skip if no text and model doesn't support images
                if not text_input and not supports_vision and not encoded_image:
                    responses[model_name] = "Please provide either text or image input"
                    continue

                messages = prepare_messages(text_input, encoded_image, supports_vision)
                
                # Special handling for text-only models with image input
                if not supports_vision and encoded_image:
                    if not text_input:
                        responses[model_name] = "This model requires text input (doesn't support images)"
                        continue
                    # For text models with both inputs, we'll just use the text
                    messages = prepare_messages(text_input, None, False)

                # Make the API request
                response = requests.post(
                    GROQ_API_URL,
                    json={
                        "model": model,
                        "messages": messages,
                        "max_tokens": 1000,
                        "temperature": 0.3
                    },
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    timeout=60 if supports_vision else 30
                )
                response.raise_for_status()
                
                # Process the response
                result = response.json()
                answer = result["choices"][0]["message"]["content"]
                
                # Post-process vision model responses to include medical disclaimers
                if supports_vision and encoded_image:
                    answer = (
                        "MEDICAL ANALYSIS:\n" + answer + 
                        "\n\nDisclaimer: This is not a professional diagnosis. "
                        "Please consult a healthcare provider for medical advice."
                    )
                
                # Validate and clean the response
                if not is_medical_response(answer):
                    answer = "Could not generate medical analysis. Please try again or consult a doctor."
                else:
                    answer = clean_medical_response(answer)
                
                responses[model_name] = answer
                logger.info(f"Successfully processed {model_name} response")
                
            except requests.exceptions.HTTPError as e:
                error_msg = f"API error: {str(e)}"
                if e.response.status_code == 400:
                    error_data = e.response.json()
                    error_msg = error_data.get("error", {}).get("message", error_msg)
                responses[model_name] = f"Analysis unavailable: {error_msg}"
                logger.warning(f"Model {model_name} failed: {error_msg}")
            except Exception as e:
                responses[model_name] = f"Analysis unavailable: {str(e)}"
                logger.warning(f"Model {model_name} failed: {str(e)}")

        # Add input metadata
        responses["metadata"] = {
            "text_provided": text_input is not None,
            "image_provided": image is not None,
            "disclaimer": "Not a substitute for professional medical advice",
            "note": "Some models may not support all input types"
        }

        return responses
    
    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred: {str(e)}"
        )