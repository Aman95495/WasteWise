from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import logging
from groq import Groq
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY", "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")
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable not set")

client = Groq(api_key=api_key)

def generate_response(user_message: str) -> str:
    """
    Generate a response using the Groq chat model.
    """
    response = client.chat.completions.create(
        model="llama-3.2-90b-vision-preview",
        messages=[
            {
                "role": "system",
                "content": (
                    "You're a waste management expert. Provide concise, practical advice on recycling, "
                    "proper waste disposal, and environmental sustainability."
                )
            },
            {"role": "user", "content": user_message}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chat")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Accepts a chat message and returns a response from the Groq-based EcoGuide.
    """
    prompt = f"User: {request.message}\nEcoGuide: "
    try:
        response = generate_response(prompt)
        return {"response": response}
    except Exception as e:
        logger.error("Error in /chat endpoint", exc_info=True)
        raise HTTPException(status_code=500, detail="Processing failed")
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "cli":
        user_prompt = input("Enter your waste management question: ")
        answer = generate_response(user_prompt)
        print("Response:\n", "\n".join(line.strip() for line in answer.splitlines() if line.strip()))
    else:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)