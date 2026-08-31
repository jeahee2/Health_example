let healthData = [];


// 현재 조회된 결과
let currentResult = [];


// ==========================================
// CSV 불러오기
// ==========================================

async function loadData() {

    try {

        const response =
            await fetch("health_data.csv");


        if (!response.ok) {

            throw new Error(
                "CSV 파일을 찾을 수 없습니다."
            );

        }


        const text =
            await response.text();


        healthData =
            parseCSV(text);


        console.log(
            "CSV 데이터 로드 완료"
        );


        console.log(
            "데이터 개수:",
            healthData.length
        );


        populateYearOptions();

        populateRegionOptions();


    } catch (error) {

        console.error(
            "데이터 로드 실패:",
            error
        );


        alert(
            "health_data.csv 파일을 불러오지 못했습니다."
        );

    }

}


// ==========================================
// CSV 파싱
// ==========================================

function parseCSV(text) {

    // 앞에 BOM(\uFEFF)이 남아있는 경우 제거
    const cleanText =
        text.replace(/^\uFEFF/, "");


    const lines =
        cleanText
            .trim()
            .split(/\r?\n/);


    if (lines.length < 2) {

        return [];

    }


    const headers =
        lines[0]
            .split(",")
            .map(
                value =>
                    value.trim()
            );


    return lines
        .slice(1)
        .map(line => {

            const values =
                line.split(",");


            const item = {};


            headers.forEach(
                (header, index) => {

                    item[header] =
                        values[index]
                        ?.trim() || "";

                }
            );


            item.수량 =
                Number(
                    item.수량 || 0
                );


            item.금액 =
                Number(
                    item.금액 || 0
                );


            return item;

        });

}


// ==========================================
// 기간(캘린더) 입력 범위 설정
//    데이터에 있는 최소~최대 진료년월로
//    시작월 / 종료월 <input type="month">의
//    선택 가능 범위를 제한
// ==========================================

function populateYearOptions() {

    const yearMonths =
        healthData
            .map(
                item => item.진료년월
            )
            .filter(
                value => value
            )
            .sort();


    if (yearMonths.length === 0) {

        return;

    }


    const minMonth =
        yearMonths[0];

    const maxMonth =
        yearMonths[
            yearMonths.length - 1
        ];


    const startInput =
        document.getElementById(
            "startMonth"
        );

    const endInput =
        document.getElementById(
            "endMonth"
        );


    startInput.min = minMonth;
    startInput.max = maxMonth;

    endInput.min = minMonth;
    endInput.max = maxMonth;

}


// ==========================================
// 시도 옵션 채우기
//    데이터에 있는 시도 목록을 <select>에
//    자동으로 채워서 실제로 필터링이 되게 함
// ==========================================

function populateRegionOptions() {

    const regionSelect =
        document.getElementById(
            "region"
        );


    const regions =
        [...new Set(
            healthData
                .map(item => item.시도)
                .filter(value => value)
        )].sort();


    regions.forEach(region => {

        const option =
            document.createElement(
                "option"
            );

        option.value = region;
        option.textContent = region;

        regionSelect.appendChild(
            option
        );

    });

}


// ==========================================
// 조회
// ==========================================

function searchData() {

    const code =
        document
            .getElementById(
                "ingredientCode"
            )
            .value
            .trim();


    const name =
        document
            .getElementById(
                "ingredientName"
            )
            .value
            .trim();


    const startMonth =
        document
            .getElementById(
                "startMonth"
            )
            .value;

    const endMonth =
        document
            .getElementById(
                "endMonth"
            )
            .value;


    const region =
        document
            .getElementById(
                "region"
            )
            .value;


    // 데이터 필터링

    const result =
        healthData.filter(item => {


            // 성분코드

            const codeMatch =
                code === ""
                ||
                String(
                    item.성분코드 || ""
                )
                    .includes(code);


            // 성분명

            const nameMatch =
                name === ""
                ||
                String(
                    item.성분명 || ""
                )
                    .includes(name);


            // 조회 기간 (시작월 ~ 종료월)
            //    진료년월이 "YYYY-MM" 형식으로
            //    고정되어 있어 문자열 비교로
            //    범위 판정이 가능함

            const itemMonth =
                String(
                    item.진료년월 || ""
                );

            const startMatch =
                startMonth === ""
                ||
                itemMonth >= startMonth;

            const endMatch =
                endMonth === ""
                ||
                itemMonth <= endMonth;


            // 시도
            // (시군구는 별도 검색 없이,
            //  시도 검색 결과에 자동으로 함께 표시됨)

            const regionMatch =
                region === "전체"
                ||
                item.시도 === region;


            return (
                codeMatch
                &&
                nameMatch
                &&
                startMatch
                &&
                endMatch
                &&
                regionMatch
            );

        });


    // 현재 조회 결과 저장

    currentResult = result;


    // 화면 출력

    renderTable(result);

    renderSummary(result);

    renderChart(result);

}


// ==========================================
// 결과 테이블
//    HTML <thead> 순서: 성분코드, 성분명, 시도,
//    시군구, 진료년월, 수량, 금액 (7개)
// ==========================================

function renderTable(data) {

    const table =
        document.getElementById(
            "resultTableBody"
        );


    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="empty"
                >
                    조회 결과가 없습니다.
                </td>

            </tr>
        `;

        return;

    }


    data.forEach(item => {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `
            <td>
                ${item.성분코드 || ""}
            </td>

            <td>
                ${item.성분명 || ""}
            </td>

            <td>
                ${item.시도 || ""}
            </td>

            <td>
                ${item.시군구 || ""}
            </td>

            <td>
                ${item.진료년월 || ""}
            </td>

            <td>
                ${formatNumber(item.수량)}
            </td>

            <td>
                ${formatNumber(item.금액)}
            </td>
        `;


        table.appendChild(row);

    });

}


// ==========================================
// 요약
// ==========================================

function renderSummary(data) {

    let totalQuantity = 0;

    let totalAmount = 0;


    data.forEach(item => {

        totalQuantity +=
            Number(item.수량) || 0;


        totalAmount +=
            Number(item.금액) || 0;

    });


    document
        .getElementById(
            "totalQuantity"
        )
        .textContent =
        formatNumber(
            totalQuantity
        );


    document
        .getElementById(
            "totalAmount"
        )
        .textContent =
        formatNumber(
            totalAmount
        );


    document
        .getElementById(
            "totalCount"
        )
        .textContent =
        formatNumber(
            data.length
        );

}


// ==========================================
// 시도별 차트
// ==========================================

function renderChart(data) {

    const chart =
        document.getElementById(
            "usageChart"
        );


    chart.innerHTML = "";


    if (data.length === 0) {

        chart.innerHTML = `
            <div class="chart-empty">
                조회 결과가 없습니다.
            </div>
        `;

        return;

    }


    const districtData = {};


    data.forEach(item => {

        const district =
            item.시군구;


        if (!districtData[district]) {

            districtData[district] = 0;

        }


        districtData[district] +=
            Number(item.수량) || 0;

    });


    const values =
        Object.values(
            districtData
        );


    const maxValue =
        Math.max(
            ...values,
            1
        );


    Object.entries(
        districtData
    ).forEach(
        ([district, value]) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "bar-item";


            const height =
                (value / maxValue) * 280;


            item.innerHTML = `
                <div class="bar-value">
                    ${formatNumber(value)}
                </div>

                <div
                    class="bar"
                    style="height: ${height}px;"
                ></div>

                <div class="bar-label">
                    ${district}
                </div>
            `;


            chart.appendChild(item);

        }
    );

}


// ==========================================
// 숫자 표시
// ==========================================

function formatNumber(value) {

    return Number(value || 0)
        .toLocaleString("ko-KR");

}


// ==========================================
// 엑셀 다운로드
// ==========================================

function downloadExcel() {

    if (
        currentResult.length === 0
    ) {

        alert(
            "다운로드할 조회 결과가 없습니다."
        );

        return;

    }


    const excelData =
        currentResult.map(
            item => ({

                "성분코드":
                    item.성분코드,

                "성분명":
                    item.성분명,

                "연도":
                    item.연도,

                "진료년월":
                    item.진료년월,

                "시도":
                    item.시도,

                "시군구":
                    item.시군구,

                "수량":
                    item.수량,

                "금액":
                    item.금액

            })
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            excelData
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "조회결과"
    );


    XLSX.writeFile(
        workbook,
        "의약품_성분_사용실적.xlsx"
    );

}


// ==========================================
// 조회 버튼
// ==========================================

document
    .getElementById(
        "searchButton"
    )
    .addEventListener(
        "click",
        searchData
    );


// ==========================================
// 엑셀 버튼
// ==========================================

document
    .getElementById(
        "excelButton"
    )
    .addEventListener(
        "click",
        downloadExcel
    );


// ==========================================
// 페이지 시작
// ==========================================

loadData();