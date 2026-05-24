let currentCurrency = "EUR";
let rates = [];

const symbols = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    SEK: "kr"
}

async function loadrates() {
    const res = await fetch("https://api.frankfurther.app/v2/rates?base=EUR&quotes=USD,GBP,SEK");

    const data = await res.json();

    data.forEach(entry => {
        rates[entry.quote] = entry.rate;
    });

    updatePrices();
}

function updatePrices() {
    document.querrySelectorAll(".price").forEach(element => {
        const basePrice = praseFloat(element.dataset.basePrice);
        const converted = basePrice * rates[currentCurrency];
        element.innerText = symbols[currentCurrency] + converted.toFixed(2);
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