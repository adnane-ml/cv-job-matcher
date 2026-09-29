from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.cv import router as cv_router
from app.api.match import router as match_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router)
app.include_router(match_router)

@app.get("/health")
def health():
    return {"status": "ok"}