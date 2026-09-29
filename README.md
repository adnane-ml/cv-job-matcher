# CV Job Matcher 🤖

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![LangGraph](https://img.shields.io/badge/LangGraph-0.2-orange)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Mistral](https://img.shields.io/badge/Mistral-7B-purple)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

An AI-powered job matching agent that analyzes your CV against real job offers scraped from Rekrute.ma, scoring each position and explaining the match using a local LLM.

---

## How It Works

1. Upload your CV (PDF)
2. Enter a job keyword (e.g. "python", "devops")
3. The LangGraph agent scrapes live job offers from Rekrute.ma
4. Mistral 7B scores each job against your CV (0–100)
5. Results show strengths, gaps, and a match explanation per offer

---

## Features

- PDF parsing with PyMuPDF
- Live job scraping (no API key needed)
- AI scoring via local Mistral 7B through Ollama
- LangGraph agentic pipeline (scrape → score)
- Color-coded match scores (green / orange / red)
- Expandable match detail cards
- Fully local — no data sent to the cloud

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite                   |
| Backend   | FastAPI + Uvicorn                 |
| Agent     | LangGraph StateGraph              |
| LLM       | Mistral 7B via Ollama             |
| Scraping  | BeautifulSoup4 + Requests         |
| PDF       | PyMuPDF                           |
| Container | Docker Compose                    |

---

## Architecture

```
User uploads CV + keyword
↓
FastAPI /match endpoint
↓
LangGraph Pipeline
├── scrape_node → BeautifulSoup scrapes Rekrute.ma
└── score_node → Mistral scores each job vs CV
↓
Ranked matches returned to frontend

```


---

## Getting Started

### Prerequisites

- Docker + Docker Compose
- [Ollama](https://ollama.com) installed and running locally
- Mistral model pulled: `ollama pull mistral`

### Run

git clone https://github.com/adnane-ml/cv-job-matcher.git
cd cv-job-matcher

cp frontend/.env.example frontend/.env
# Edit frontend/.env and set VITE_API_URL=http://localhost:8000

docker compose up --build


Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
cv-job-matcher/
├── backend/
│ ├── app/
│ │ ├── agent/
│ │ │ └── matcher.py # LangGraph pipeline
│ │ ├── api/
│ │ │ ├── cv.py # /cv/parse endpoint
│ │ │ └── match.py # /match endpoint
│ │ ├── tools/
│ │ │ ├── cv_parser.py # PyMuPDF PDF extractor
│ │ │ └── scraper.py # Rekrute.ma scraper
│ │ └── main.py
│ ├── requirements.txt
│ └── Dockerfile
├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ └── App.css
│ ├── .env.example
│ └── Dockerfile
└── docker-compose.yml
```

---

## API Endpoints

| Method | Endpoint     | Description                        |
|--------|--------------|------------------------------------|
| POST   | /match       | Upload CV + keyword, get matches   |
| POST   | /cv/parse    | Extract text from PDF              |
| GET    | /health      | Health check                       |

---

## Author

**Adnane El Hissen** — [GitHub](https://github.com/adnane-ml)