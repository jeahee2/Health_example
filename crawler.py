import requests
from bs4 import BeautifulSoup
import pandas as pd
from pathlib import Path
from datetime import datetime


# ==========================================
# 기본 설정
# ==========================================

URL = "https://opendata.hira.or.kr/op/opc/olapGnlInfoTab2.do"

SAVE_DIR = Path("data")
SAVE_DIR.mkdir(exist_ok=True)

RAW_FILE = SAVE_DIR / "hira_raw.xlsx"
LONG_FILE = SAVE_DIR / "hira_long.xlsx"


# ==========================================
# 1. HIRA 페이지 요청
# ==========================================

def get_page():

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 "
            "(KHTML, like Gecko) "
            "Chrome/151.0.0.0 Safari/537.36"
        )
    }

    response = requests.get(
        URL,
        headers=headers,
        timeout=30
    )

    response.raise_for_status()

    response.encoding = response.apparent_encoding

    return response.text


# ==========================================
# 2. 페이지 구조 확인
# ==========================================

def parse_page(html):

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    print("페이지 제목:")
    print(soup.title.get_text(strip=True))

    print("\n페이지에서 찾은 form:")

    forms = soup.find_all("form")

    for index, form in enumerate(forms):

        print(
            index,
            form.get("id"),
            form.get("name"),
            form.get("action"),
            form.get("method")
        )

    return soup


# ==========================================
# 3. 페이지에서 입력 요소 확인
# ==========================================

def find_inputs(soup):

    print("\n입력 요소:")

    for element in soup.find_all(
        ["input", "select", "button"]
    ):

        print({
            "tag": element.name,
            "id": element.get("id"),
            "name": element.get("name"),
            "value": element.get("value"),
            "type": element.get("type"),
            "text": element.get_text(
                " ",
                strip=True
            )[:50]
        })


# ==========================================
# 4. HTML 저장
# ==========================================

def save_html(html):

    file = SAVE_DIR / "hira_page.html"

    file.write_text(
        html,
        encoding="utf-8"
    )

    print(
        f"\nHTML 저장 완료: {file}"
    )


# ==========================================
# 실행
# ==========================================

if __name__ == "__main__":

    print("=" * 50)
    print("HIRA 성분 사용실적 크롤러")
    print("=" * 50)

    html = get_page()

    print("\n페이지 다운로드 성공!")

    soup = parse_page(html)

    find_inputs(soup)

    save_html(html)

    print("\n크롤링 기본 단계 완료!")