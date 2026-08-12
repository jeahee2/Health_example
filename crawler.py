import requests
from pathlib import Path


BASE_URL = "https://opendata.hira.or.kr"
PAGE_URL = f"{BASE_URL}/op/opc/olapGnlInfoTab2.do"
DOWNLOAD_URL = f"{BASE_URL}/op/opc/downExcelGnlInfoTab2.do"

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)


# 전국 시도 코드
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
    "세종": "41",
}


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


def connect():
    """HIRA 세션 생성"""

    response = session.get(
        PAGE_URL,
        timeout=30
    )

    response.raise_for_status()

    response.encoding = response.apparent_encoding

    print("HIRA 접속 성공")

    return response


def download_excel(
    region_code,
    start_month,
    end_month,
    search_word
):
    """
    HIRA Excel 다운로드 테스트
    """

    print()
    print("=" * 60)
    print("HIRA Excel 다운로드")
    print("=" * 60)

    print("시도 :", region_code)
    print("기간 :", start_month, "~", end_month)
    print("검색 :", search_word)


    # HIRA 페이지의 실제 form 값에 맞춤
    data = {
        # 성분 검색어
        "searchWrd": search_word,

        # 숨겨진 값
        "olapCd": "",
        "olapCdNm": "",

        # 진료년월
        "sDiagYm": start_month,
        "eDiagYm": end_month,
        "sYm": start_month,
        "eYm": end_month,

        # 시도
        "ykihoPlcTpCd": region_code,

        # 보험자구분
        # 0 = 전체
        "gubun": "0",

        # 조제/처방구분
        # 201 = 조제기준
        "tabGubun": "201",

        # 요양기관종별
        # 전체
        "ykihoGubun": "all",
    }


    response = session.post(
        DOWNLOAD_URL,
        data=data,
        timeout=60
    )


    print("HTTP 상태 :", response.status_code)
    print("Content-Type :", response.headers.get("Content-Type"))
    print("파일 크기 :", len(response.content))


    response.raise_for_status()


    # 파일 저장
    output_file = DATA_DIR / "hira_test.xlsx"

    output_file.write_bytes(
        response.content
    )


    print()
    print("저장 완료")
    print(output_file)


def main():

    print("=" * 60)
    print("HIRA 전국 데이터 크롤링 테스트")
    print("=" * 60)


    # -----------------------------------------
    # 1. HIRA 접속
    # -----------------------------------------

    connect()


    # -----------------------------------------
    # 2. 서울 테스트
    #
    # 중요:
    # search_word는 실제 HIRA에서 선택한
    # 성분/항목명이 들어가야 함
    # -----------------------------------------

    download_excel(
        region_code="11",
        start_month="2026-03",
        end_month="2026-03",
        search_word="테스트"
    )


if __name__ == "__main__":
    main()

