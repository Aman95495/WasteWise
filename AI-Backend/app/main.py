from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers
from app.routers import wasteManagement, quiz_app
app.include_router(wasteManagement.router, prefix="/backend/ai")
app.include_router(quiz_app.router, prefix="/backend/ai")

@app.get("/test")
async def test():
    return {"message": "API is working"}

@app.on_event("startup")
async def print_routes():
    for route in app.routes:
        print(f"{route.path} - {route.methods}")

