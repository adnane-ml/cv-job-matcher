from app.tools.cv_parser import parse_cv

from fastapi import APIRouter, UploadFile, File


router = APIRouter()

@router.post("/cv/parse")
async def upload_cv(file:UploadFile = File(...)):
    content = await file.read()
    text = parse_cv(content)
    return {"text" : text[:2000]} #LLM Limit
