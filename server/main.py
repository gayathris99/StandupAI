from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import auth, standups

load_dotenv()

app = FastAPI(title='StandupAI')

# Allow requests from react app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth")
app.include_router(standups.router, prefix="/api/standups")

@app.get('/health')
def health():
    return {"status": "ok"}
