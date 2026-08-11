let originalData = [];
let filteredData = [];
let usageChart = null;


// ================================
// 엑셀 파일 읽기
// ================================

async function loadExcel() {

    try {

        const response = await fetch(
            "성분사용실적_세로형.xlsx"
        );

        const buffer = await response.arrayBuffer();

        const workbook = XLSX.read(buffer, {
            type: "array"
        });

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        originalData = XLSX.utils.sheet_to_json(sheet);

        console.log("데이터:", originalData);

        updateDistrict();

        searchData();

    } catch (error) {

        console.error(error);

        document.getElementById("resultCount").textContent =
            "엑셀 파일을 불러오지 못했습니다.";

    }
}


// ================================
// 시군구 목록
// ================================

function updateDistrict() {

    const region =
        document.getElementById("region").value;

    const district =
        document.getElementById("district");

    district.innerHTML =
        `<option value="">전체</option>`;

    const districts = [
        ...new Set(
            originalData
                .filter(row => row["시도명칭"] === region)
                .map(row => row["시군구명칭"])
                .filter(Boolean)
        )
    ];

    districts.forEach(name => {

        const option =
            document.createElement("option");

        option.value = name;
        option.textContent = name;

        district.appendChild(option);

    });
}


// ================================
// 데이터 검색
// ================================

function searchData() {

    const ingredient =
        document.getElementById("ingredient")
            .value
            .trim();

    const ingredientName =
        document.getElementById("ingredientName")
            .value
            .trim();

    const region =
        document.getElementById("region").value;

    const district =
        document.getElementById("district").value;

    const hospital =
        document.getElementById("hospital").value;

    const startDate =
        document.getElementById("startDate").value;

    const endDate =
        document.getElementById("endDate").value;


    filteredData = originalData.filter(row => {

        if (region &&
            row["시도명칭"] !== region) {
            return false;
        }

        if (district &&
            row["시군구명칭"] !== district) {
            return false;
        }

        if (hospital &&
            row["요양기관종별"] !== hospital) {
            return false;
        }

        if (ingredient &&
            !String(row["성분코드"])
                .includes(ingredient)) {
            return false;
        }

        if (ingredientName &&
            !String(row["성분명"])
                .toLowerCase()
                .includes(ingredientName.toLowerCase())) {
            return false;
        }

        if (startDate &&
            row["기간"] < startDate) {
            return false;
        }

        if (endDate &&
            row["기간"] > endDate) {
            return false;
        }

        return true;

    });


    renderResult();

}


// ================================
// 결과 표시
// ================================

function renderResult() {

    const table =
        document.getElementById("resultTable");

    table.innerHTML = "";

    filteredData.forEach(row => {

        const tr =
            document.createElement("tr");

        tr.innerHTML = `
            <td>${row["성분코드"] ?? ""}</td>
            <td>${row["성분명"] ?? ""}</td>
            <td>${row["시도명칭"] ?? ""}</td>
            <td>${row["시군구명칭"] ?? ""}</td>
            <td>${row["요양기관종별"] ?? ""}</td>
            <td>${row["기간"] ?? ""}</td>
            <td>${formatNumber(row["수량"])}</td>
            <td>${formatNumber(row["금액"])}원</td>
        `;

        table.appendChild(tr);

    });


    updateSummary();

    updateChart();

}


// ================================
// 요약
// ================================

function updateSummary() {

    const totalQuantity =
        filteredData.reduce(
            (sum, row) =>
                sum + Number(row["수량"] || 0),
            0
        );

    const totalAmount =
        filteredData.reduce(
            (sum, row) =>
                sum + Number(row["금액"] || 0),
            0
        );

    const ingredients =
        new Set(
            filteredData.map(
                row => row["성분코드"]
            )
        );


    document.getElementById("totalQuantity")
        .textContent =
        formatNumber(totalQuantity);

    document.getElementById("totalAmount")
        .textContent =
        formatNumber(totalAmount) + "원";

    document.getElementById("ingredientCount")
        .textContent =
        ingredients.size;

    document.getElementById("regionResult")
        .textContent =
        document.getElementById("region").value;

    document.getElementById("resultCount")
        .textContent =
        `총 ${filteredData.length.toLocaleString()}건`;
}


// ================================
// 차트
// ================================

function updateChart() {

    const monthly = {};

    filteredData.forEach(row => {

        const month = row["기간"];

        if (!monthly[month]) {
            monthly[month] = 0;
        }

        monthly[month] +=
            Number(row["수량"] || 0);

    });


    const labels =
        Object.keys(monthly).sort();

    const values =
        labels.map(
            month => monthly[month]
        );


    const ctx =
        document.getElementById("usageChart")
            .getContext("2d");


    if (usageChart) {
        usageChart.destroy();
    }


    usageChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{
                label: "월별 사용 수량",
                data: values,
                tension: 0.3,
                borderWidth: 2,
                fill: false
            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: true
                }

            },

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });

}


// ================================
// 숫자 표시
// ================================

function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("ko-KR");

}


// ================================
// 이벤트
// ================================

document
    .getElementById("region")
    .addEventListener(
        "change",
        updateDistrict
    );


document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        searchData
    );


document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        () => {

            document.getElementById("ingredient").value = "";
            document.getElementById("ingredientName").value = "";
            document.getElementById("startDate").value = "2025-01";
            document.getElementById("endDate").value = "2026-03";
            document.getElementById("region").value = "서울";
            document.getElementById("hospital").value = "";

            updateDistrict();
            searchData();

        }
    );


// ================================
// 시작
// ================================

loadExcel();