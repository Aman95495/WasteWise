from fastapi import APIRouter, HTTPException, UploadFile, File
import base64
import requests
import io
from PIL import Image
import logging
import os
from dotenv import load_dotenv
import re

router = APIRouter(prefix="/quiz", tags=["quiz"])

load_dotenv()
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY_QUIZ")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY_QUIZ is not set in the .env file")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def clean_quiz_response(text: str) -> str:
    """Clean common AI phrasing to make it suitable for frontend"""
    replacements = {
        "I'm sorry": "Note",
        "I cannot": "It appears this image may not clearly show quiz content.",
        "you should": "Suggestion:",
        "Answer:": "\nAnswer:"
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def prepare_quiz_messages(encoded_image: str):
    """Prepare messages for quiz content generation from an image"""
    prompt = (
        "You are a professional quizmaster AI. Analyze this image carefully and generate a quiz item as follows:\n\n"
        "1. Identify what is visible in the image.\n"
        "2. Formulate one multiple-choice question related to the subject.\n"
        "3. Provide 4 answer options.\n"
        "4. Indicate the correct answer.\n"
        "Format your response like this:\n"
        "Question: [your question]\n"
        "Options:\n"
        "A) ...\nB) ...\nC) ...\nD) ...\n"
        "Answer: [Correct Option Letter]"
    )

    content = [
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
    ]

    return [{"role": "user", "content": content}]


def parse_quiz_response(text: str) -> dict:
    """Parse AI response into structured quiz format"""
    question = re.search(r"Question:\s*(.*)", text)
    options = re.findall(r"([A-D])\)\s*(.*)", text)
    answer = re.search(r"Answer:\s*([A-D])", text)

    return {
        "question": question.group(1) if question else "No question found",
        "options": {opt[0]: opt[1] for opt in options} if options else {},
        "answer": answer.group(1) if answer else "Unknown"
    }


@router.post("/generate")
async def generate_quiz(image: UploadFile = File(...)):
    try:
        # Read and validate image
        image_content = await image.read()
        if not image_content:
            raise HTTPException(status_code=400, detail="Empty image file")

        img = Image.open(io.BytesIO(image_content))
        img.verify()
        encoded_image = base64.b64encode(image_content).decode("utf-8")
        logger.info("Image processed for quiz successfully.")

        # Vision model prompt
        vision_model = "llama-3.2-90b-vision-preview"  # Replace with latest Groq vision model
        messages = prepare_quiz_messages(encoded_image)

        response = requests.post(
            GROQ_API_URL,
            json={
                "model": vision_model,
                "messages": messages,
                "max_tokens": 800,
                "temperature": 0.5
            },
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            timeout=45
        )
        response.raise_for_status()

        result = response.json()
        raw_answer = result["choices"][0]["message"]["content"]

        cleaned_answer = clean_quiz_response(raw_answer)
        parsed = parse_quiz_response(cleaned_answer)

        return parsed

    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Quiz generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Quiz generation failed: {str(e)}"
        )
