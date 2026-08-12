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

    const lines =
        text
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


    const region =
        document
            .getElementById(
                "region"
            )
            .value;


    const prescriptionType =
        document
            .getElementById(
                "prescriptionType"
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
                    .toLowerCase()
                    .includes(
                        name.toLowerCase()
                    );


            // 시도

            const regionMatch =
                region === "전체"
                ||
                item.시도 === region;


            // 조제·처방구분

            // 조제·처방구분
const itemType =
    String(
        item["조제·처방구분"] || ""
    ).trim();

let prescriptionMatch = true;

if (prescriptionType === "조제기준") {

    prescriptionMatch =
        itemType.includes("조제기준");

}

if (prescriptionType === "처방기준") {

    prescriptionMatch =
        itemType.includes("처방기준");

}


            return (
                codeMatch
                &&
                nameMatch
                &&
                regionMatch
                &&
                prescriptionMatch
            );

        });


    // 현재 조회 결과 저장

    currentResult = result;


    // 화면 출력

    renderTable(result);

    renderSummary(result);

    renderChart(result);


    document
        .getElementById(
            "resultCount"
        )
        .textContent =
        `${result.length.toLocaleString()}건`;

}


// ==========================================
// 결과 테이블
// ==========================================

function renderTable(data) {

    const table =
        document.getElementById(
            "resultTable"
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
                ${item.진료년월 || ""}
            </td>

            <td>
                ${item.시도 || ""}
            </td>

            <td>
                ${item["조제·처방구분"] || ""}
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


    const regionData = {};


    data.forEach(item => {

        const region =
            item.시도;


        if (!regionData[region]) {

            regionData[region] = 0;

        }


        regionData[region] +=
            Number(item.수량) || 0;

    });


    const values =
        Object.values(
            regionData
        );


    const maxValue =
        Math.max(
            ...values,
            1
        );


    Object.entries(
        regionData
    ).forEach(
        ([region, value]) => {

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
                    ${region}
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

                "진료년월":
                    item.진료년월,

                "시도":
                    item.시도,

                "조제·처방구분":
                    item["조제·처방구분"],

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