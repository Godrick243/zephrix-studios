let currentCurrency = "EUR";
let rates = {};

const symbols = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    SEK: "kr",
    CAD: "C$",
    CNY: "CN¥",
    JPY: "JP¥"
}

const before = [ //before as in before cost, other wise it is after the cost
    "USD",
    "GBP",
    "CAD",
    "JPY",
    "CNY"
]

const noDecimals = [
    "JPY"
]

const select = document.getElementById("currencySelect");

select.value = currentCurrency;

select.addEventListener("change", (e) => {
    setCurrency(e.target.value);
})

async function loadRates() {
    const res = await fetch("https://api.frankfurter.dev/v2/rates?base=EUR&quotes=GBP,USD,SEK,CAD,CNY,JPY");

    const data = await res.json();

    data.forEach(entry => {
        rates[entry.quote] = entry.rate;
    });

    rates["EUR"] = 1;

    updatePrices();
}

function updatePrices() {
    document.querySelectorAll(".price").forEach(element => {
        const basePrice = parseFloat(element.dataset.basePrice);
        const converted = basePrice * rates[currentCurrency];
        console.log("base:", element.dataset.basePrice);
        console.log("rate:", rates[currentCurrency]);
        let decimals = 2;
        if (noDecimals.includes(currentCurrency)) decimals = 0;
        else decimals = 2;
        if (before.includes(currentCurrency)) {
            element.innerText = symbols[currentCurrency] + converted.toFixed(decimals);
        } else {
            element.innerText = converted.toFixed(decimals) + symbols[currentCurrency];
        }
        animatePrice(element);
    });
}

function animatePrice(element) {
    element.classList.remove("show");
    void element.offsetHeight;
    element.classList.add("show");
}

function setCurrency(currency) {
    currentCurrency = currency;

    localStorage.setItem(
        "currency",
        currency
    );

    updatePrices();
}

window.onload = () => {
    const saved = localStorage.getItem("currency");

    if (saved) {
        currentCurrency = saved;
        select.value = saved;
    }

    const box = document.querySelector(".box");

    if (box) {
        box.classList.remove("fade");

        requestAnimationFrame(() => {
            box.classList.add("fade");
        });
    }

    loadRates();
}