from fastapi import APIRouter, UploadFile, File, Form
from app.tools.cv_parser import parse_cv
from app.agent.matcher import matcher_graph

router = APIRouter()

@router.post("/match")
async def match_jobs(
    file: UploadFile = File(...),
    keyword: str = Form(...)
):
    content = await file.read()
    cv_text = parse_cv(content)

    result = await matcher_graph.ainvoke({
        "cv_text": cv_text,
        "keyword": keyword,
        "jobs": [],
        "matches": []
    })

    return {"matches": result["matches"]}