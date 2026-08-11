import requests
from bs4 import BeautifulSoup
import pandas as pd
from pathlib import Path
from datetime import datetime


# ============================================
# 기본 설정
# ============================================

URL = "https://opendata.hira.or.kr/op/opc/olapGnlInfoTab2.do"

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)


# ============================================
# 전국 시도 코드
# ============================================

REGIONS = {
    "서울": "11",
    "부산": "21",
    "인천": "22",
    "대구": "23",
    "대전": "25",
    "울산": "26",
    "경기": "31",
    "강원": "32",
    "충북": "33",
    "충남": "34",
    "전북": "35",
    "전남광주": "36",
    "경북": "37",
    "경남": "38",
    "제주": "39",
    "세종": "41"
}


# ============================================
# Session
# ============================================

session = requests.Session()

session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/151.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ko-KR,ko;q=0.9",
})


# ============================================
# 1. HIRA 페이지 접속
# ============================================

def connect():

    response = session.get(
        URL,
        timeout=30
    )

    response.raise_for_status()

    response.encoding = response.apparent_encoding

    print("HIRA 접속 성공")

    return response.text


# ============================================
# 2. 조회 요청
# ============================================

def search_hira(
    region_code,
    start_month,
    end_month,
    gubun="0"
):

    print()
    print("--------------------------------------------")
    print("조회")
    print("--------------------------------------------")

    print("시도 코드 :", region_code)
    print("시작 월   :", start_month)
    print("종료 월   :", end_month)
    print("구분      :", gubun)


    # ----------------------------------------
    # HIRA 검색 form
    # ----------------------------------------

    data = {

        # 성분코드
        # 현재는 전체 조회를 위해 빈 값
        "searchWrd": "",

        # 통계 코드
        "olapCd": "",
        "olapCdNm": "",

        # 진료년월
        "sDiagYm": start_month,
        "eDiagYm": end_month,

        "sYm": start_month,
        "eYm": end_month,

        # 시도
        "ykihoPlcTpCd": region_code,

        # 조제/처방
        # 0 = 조제기준
        # 4 = 처방기준
        "gubun": gubun,

        # 요양기관종별
        # 전체
        "ykihoGubun": "all",

        # 보험자구분
        "tabGubun": "201",

    }


    response = session.post(
        URL,
        data=data,
        timeout=60
    )

    response.raise_for_status()

    response.encoding = response.apparent_encoding


    print("응답 상태 :", response.status_code)
    print("응답 크기 :", len(response.text))

    return response.text


# ============================================
# 3. 응답 HTML 분석
# ============================================

def analyze_result(html):

    soup = BeautifulSoup(
        html,
        "html.parser"
    )


    print()
    print("--------------------------------------------")
    print("조회 결과 분석")
    print("--------------------------------------------")


    # ----------------------------------------
    # 테이블 찾기
    # ----------------------------------------

    tables = soup.find_all("table")

    print("발견한 테이블 :", len(tables))


    for index, table in enumerate(tables):

        print()
        print(f"[TABLE {index}]")

        rows = table.find_all("tr")

        for row in rows[:5]:

            cells = row.find_all(
                ["th", "td"]
            )

            values = [
                cell.get_text(
                    " ",
                    strip=True
                )
                for cell in cells
            ]

            print(values)


    return soup


# ============================================
# 4. HTML 저장
# ============================================

def save_result(html, filename):

    path = DATA_DIR / filename

    path.write_text(
        html,
        encoding="utf-8"
    )

    print()
    print("결과 저장:", path)


# ============================================
# 실행
# ============================================

def main():

    print("=" * 60)
    print("HIRA 전국 성분 사용실적 테스트")
    print("=" * 60)


    # ----------------------------------------
    # 먼저 HIRA 접속
    # ----------------------------------------

    connect()


    # ----------------------------------------
    # 테스트
    #
    # 일단 서울
    # 2026년 03월
    # 조제기준
    # ----------------------------------------

    html = search_hira(
        region_code="11",
        start_month="2026-03",
        end_month="2026-03",
        gubun="0"
    )


    # ----------------------------------------
    # 결과 분석
    # ----------------------------------------

    analyze_result(html)


    # ----------------------------------------
    # 결과 HTML 저장
    # ----------------------------------------

    save_result(
        html,
        "search_seoul.html"
    )


    print()
    print("=" * 60)
    print("테스트 완료")
    print("=" * 60)


if __name__ == "__main__":
    main()