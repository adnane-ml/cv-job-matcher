import requests
import re
from bs4 import BeautifulSoup

BASE_URL = "https://www.rekrute.com"

def extract_company(href):
    match = re.search(r'-recrutement-(.+?)-\w+-\d+\.html', href)
    if match:
        return match.group(1).replace("-", " ").title()
    return "N/A"

def scrape_rekrute(keyword: str, limit: int = 10) -> list[dict]:
    url = f"{BASE_URL}/offres.html?s=3&p=1&o=1&query={keyword}"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(res.text, "html.parser")

    offres = []
    for tag in soup.find_all(class_="titreJob")[:limit]:
        a = tag if tag.name == "a" else tag.find("a")
        if not a:
            continue
        href = a.get("href", "")
        titre = a.get_text(strip=True)
        offres.append({
            "titre": titre,
            "entreprise": extract_company(href),
            "url": BASE_URL + href
        })
    return offres