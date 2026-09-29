import os
import json
import httpx
from langgraph.graph import StateGraph, END
from typing import TypedDict
from app.tools.scraper import scrape_rekrute

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

class MatcherState(TypedDict):
    cv_text: str
    keyword: str
    jobs: list
    matches: list

async def scrape_node(state: MatcherState) -> MatcherState:
    jobs = scrape_rekrute(state["keyword"], limit=5)
    return {**state, "jobs": jobs}

async def score_node(state: MatcherState) -> MatcherState:
    matches = []
    async with httpx.AsyncClient(timeout=120) as client:
        for job in state["jobs"]:
            prompt = f"""Tu es un expert RH. Analyse le match entre ce CV et cette offre.

CV (extrait):
{state["cv_text"][:800]}

Offre: {job["titre"]}
Entreprise: {job["entreprise"]}

Réponds UNIQUEMENT en JSON valide:
{{"score": 0-100, "raison": "explication courte", "points_forts": ["point1", "point2"], "manques": ["manque1"]}}"""

            res = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={"model": "mistral", "prompt": prompt, "stream": False}
            )
            raw = res.json()["response"]
            try:
                import re
                match = re.search(r'\{.*\}', raw, re.DOTALL)
                analysis = json.loads(match.group()) if match else {}
            except:
                analysis = {"score": 0, "raison": "Erreur d'analyse", "points_forts": [], "manques": []}

            matches.append({**job, **analysis})

    matches.sort(key=lambda x: x.get("score", 0), reverse=True)
    return {**state, "matches": matches}

def build_graph():
    graph = StateGraph(MatcherState)
    graph.add_node("scrape", scrape_node)
    graph.add_node("score", score_node)
    graph.set_entry_point("scrape")
    graph.add_edge("scrape", "score")
    graph.add_edge("score", END)
    return graph.compile()

matcher_graph = build_graph()