```javascript
// ============================================
// 전국 의약품 사용실적 조회
// ============================================


// ============================================
// 테스트 성분 데이터
// ============================================

const ingredientData = [
    {
        code: "100101ACH",
        name: "아세트아미노펜"
    },
    {
        code: "100201ACH",
        name: "이부프로펜"
    },
    {
        code: "100301ACH",
        name: "아목시실린"
    },
    {
        code: "100401ACH",
        name: "클로르페니라민"
    },
    {
        code: "100501ACH",
        name: "오메프라졸"
    }
];


// ============================================
// 테스트 사용실적 데이터
// ============================================

const usageData = [
    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "서울",
        "조제·처방구분": "조제기준",
        수량: 1250000,
        금액: 450000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "부산",
        "조제·처방구분": "조제기준",
        수량: 850000,
        금액: 310000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "대구",
        "조제·처방구분": "조제기준",
        수량: 720000,
        금액: 270000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "인천",
        "조제·처방구분": "조제기준",
        수량: 690000,
        금액: 250000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "광주",
        "조제·처방구분": "조제기준",
        수량: 400000,
        금액: 150000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "대전",
        "조제·처방구분": "조제기준",
        수량: 450000,
        금액: 170000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "울산",
        "조제·처방구분": "조제기준",
        수량: 280000,
        금액: 100000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "세종",
        "조제·처방구분": "조제기준",
        수량: 120000,
        금액: 45000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "경기",
        "조제·처방구분": "조제기준",
        수량: 2100000,
        금액: 780000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "강원",
        "조제·처방구분": "조제기준",
        수량: 300000,
        금액: 110000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "충북",
        "조제·처방구분": "조제기준",
        수량: 350000,
        금액: 130000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "충남",
        "조제·처방구분": "조제기준",
        수량: 420000,
        금액: 160000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "전북",
        "조제·처방구분": "조제기준",
        수량: 380000,
        금액: 140000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "전남",
        "조제·처방구분": "조제기준",
        수량: 290000,
        금액: 105000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "경북",
        "조제·처방구분": "조제기준",
        수량: 410000,
        금액: 155000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "경남",
        "조제·처방구분": "조제기준",
        수량: 530000,
        금액: 195000000
    },

    {
        진료년월: "2026-03",
        성분코드: "100101ACH",
        성분명칭: "아세트아미노펜",
        시도: "제주",
        "조제·처방구분": "조제기준",
        수량: 150000,
        금액: 55000000
    }
];


// ============================================
// 전역 변수
// ============================================

let selectedIngredient = null;

let usageChart = null;


// ============================================
// 페이지 로드
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setDefaultMonth();

        setupEvents();

    }
);


// ============================================
// 이벤트 등록
// ============================================

function setupEvents() {

    const ingredientSearchButton =
        document.getElementById(
            "ingredientSearchButton"
        );


    const searchButton =
        document.getElementById(
            "searchButton"
        );


    ingredientSearchButton.addEventListener(
        "click",
        searchIngredient
    );


    searchButton.addEventListener(
        "click",
        searchUsage
    );

}


// ============================================
// 기본 날짜
// ============================================

function setDefaultMonth() {

    const monthInput =
        document.getElementById(
            "month"
        );


    monthInput.value = "2026-03";

}


// ============================================
// 성분 검색
// ============================================

function searchIngredient() {

    const code =
        document
            .getElementById("ingredientCode")
            .value
            .trim();


    const name =
        document
            .getElementById("ingredientName")
            .value
            .trim();


    if (code === "" && name === "") {

        alert(
            "성분코드 또는 성분명칭을 입력해주세요."
        );

        return;
    }


    const result =
        ingredientData.filter(
            function (item) {

                const codeMatch =
                    code === ""
                    ||
                    item.code
                        .toLowerCase()
                        .includes(
                            code.toLowerCase()
                        );


                const nameMatch =
                    name === ""
                    ||
                    item.name.includes(name);


                return codeMatch && nameMatch;

            }
        );


    renderIngredientResult(result);

}


// ============================================
// 성분 검색 결과
// ============================================

function renderIngredientResult(data) {

    const container =
        document.getElementById(
            "ingredientResult"
        );


    container.innerHTML = "";


    if (data.length === 0) {

        container.innerHTML = `
            <div class="empty">
                검색된 성분이 없습니다.
            </div>
        `;

        return;
    }


    data.forEach(
        function (item) {

            const element =
                document.createElement("div");


            element.className =
                "ingredient-item";


            element.innerHTML = `
                <div>

                    <strong>
                        ${item.code}
                    </strong>

                    <span>
                        ${item.name}
                    </span>

                </div>

                <button
                    type="button"
                    class="select-button"
                >
                    선택
                </button>
            `;


            const selectButton =
                element.querySelector(
                    ".select-button"
                );


            selectButton.addEventListener(
                "click",
                function () {

                    selectIngredient(item);

                }
            );


            container.appendChild(element);

        }
    );

}


// ============================================
// 성분 선택
// ============================================

function selectIngredient(item) {

    selectedIngredient = item;


    const container =
        document.getElementById(
            "selectedIngredient"
        );


    container.innerHTML = `
        <div class="selected-content">

            <span class="selected-code">
                ${item.code}
            </span>

            <span class="selected-name">
                ${item.name}
            </span>

        </div>
    `;

}


// ============================================
// 사용실적 조회
// ============================================

function searchUsage() {

    if (selectedIngredient === null) {

        alert(
            "먼저 성분을 선택해주세요."
        );

        return;
    }


    const month =
        document
            .getElementById("month")
            .value;


    const region =
        document
            .getElementById("region")
            .value;


    const usageType =
        document
            .getElementById("usageType")
            .value;


    if (month === "") {

        alert(
            "진료년월을 선택해주세요."
        );

        return;
    }


    const result =
        usageData.filter(
            function (item) {

                const ingredientMatch =
                    item.성분코드
                    ===
                    selectedIngredient.code;


                const monthMatch =
                    item.진료년월
                    ===
                    month;


                const typeMatch =
                    item["조제·처방구분"]
                    ===
                    usageType;


                const regionMatch =
                    region === "전체"
                    ||
                    item.시도 === region;


                return (
                    ingredientMatch
                    &&
                    monthMatch
                    &&
                    typeMatch
                    &&
                    regionMatch
                );

            }
        );


    renderTable(result);

    renderSummary(result);

    renderChart(result);

}


// ============================================
// 결과 테이블
// ============================================

function renderTable(data) {

    const table =
        document.getElementById(
            "resultTable"
        );


    const count =
        document.getElementById(
            "resultCount"
        );


    table.innerHTML = "";


    count.textContent =
        `${data.length}건`;


    if (data.length === 0) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="5"
                    class="empty"
                >
                    조회된 데이터가 없습니다.
                </td>

            </tr>
        `;

        return;
    }


    data.forEach(
        function (item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>
                    ${item.진료년월}
                </td>

                <td>
                    ${item.시도}
                </td>

                <td>
                    ${item["조제·처방구분"]}
                </td>

                <td>
                    ${formatNumber(item.수량)}
                </td>

                <td>
                    ${formatNumber(item.금액)}
                </td>
            `;


            table.appendChild(row);

        }
    );

}


// ============================================
// 요약
// ============================================

function renderSummary(data) {

    let totalQuantity = 0;

    let totalAmount = 0;


    data.forEach(
        function (item) {

            totalQuantity +=
                Number(item.수량);


            totalAmount +=
                Number(item.금액);

        }
    );


    document
        .getElementById("totalQuantity")
        .textContent =
        formatNumber(totalQuantity);


    document
        .getElementById("totalAmount")
        .textContent =
        formatNumber(totalAmount);

}


// ============================================
// 차트
// ============================================

function renderChart(data) {

    const canvas =
        document.getElementById(
            "usageChart"
        );


    if (usageChart !== null) {

        usageChart.destroy();

        usageChart = null;

    }


    if (data.length === 0) {

        return;

    }


    const labels =
        data.map(
            function (item) {

                return item.시도;

            }
        );


    const quantities =
        data.map(
            function (item) {

                return Number(item.수량);

            }
        );


    usageChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            label: "수량",

                            data: quantities
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: true
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function (value) {

                                        return formatNumber(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


// ============================================
// 숫자 포맷
// ============================================

function formatNumber(value) {

    return Number(value)
        .toLocaleString("ko-KR");

}
```
