let currentCurrency = "EUR";
let rates = {};

const symbols = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    SEK: "kr"
}

const before = [ //before as in before cost, other wise it is after the cost
    "USD",
    "GBP"
]

const select = document.getElementById("currencySelect");

select.value = currentCurrency;

select.addEventListener("change", (e) => {
    setCurrency(e.target.value);
})

async function loadRates() {
    const res = await fetch("https://api.frankfurter.dev/v2/rates?base=EUR&quotes=GBP,USD,SEK");

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
        if (before.includes(currentCurrency)) {
            element.innerText = symbols[currentCurrency] + converted.toFixed(2);
        } else {
            element.innerText = converted.toFixed(2) + symbols[currentCurrency];
        }
    });
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
    }

    loadRates();
}