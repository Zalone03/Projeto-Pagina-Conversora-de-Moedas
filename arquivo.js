let currencies = {
  from: {
    code: "BRL",
    name: "Real Brasileiro",
    symbol: "R$",
    flag: "br",
  },
  to: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "eu",
  },
};

let currentTarget = null;
const currencyList = document.getElementById("currencyList");


function openList(element, target) {
  currentTarget = target;
  currencyList.style.display = "none";
  element.parentElement.appendChild(currencyList);
  currencyList.style.display = "block";
}

function selectCurrency(code, name, symbol, flag) {
  currencies[currentTarget] = { code, name, symbol, flag };

  const box = document.querySelector(`#${currentTarget} .currency-select`);
  box.innerHTML = `
    <img class="flag" src="https://flagcdn.com/w40/${flag}.png">
    <span>${name}</span>
  `;

  if (currentTarget === "from") {
    document.getElementById("currencySymbol").textContent = symbol;
  }

  currencyList.style.display = "none";
  convert();
}

function swapCurrencies() {
  [currencies.from, currencies.to] = [currencies.to, currencies.from];

  document.querySelector("#from .currency-select").innerHTML = `
    <img class="flag" src="https://flagcdn.com/w40/${currencies.from.flag}.png">
    <span>${currencies.from.name}</span>
  `;

  document.querySelector("#to .currency-select").innerHTML = `
    <img class="flag" src="https://flagcdn.com/w40/${currencies.to.flag}.png">
    <span>${currencies.to.name}</span>
  `;

  document.getElementById("currencySymbol").textContent =
    currencies.from.symbol;

  convert();
}

async function fetchRate(pair) {
  const url = `https://economia.awesomeapi.com.br/json/last/${pair}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar cotação");
  }

  const data = await response.json();
  const key = Object.keys(data)[0];

  return Number(data[key].bid);
}


async function getRateViaUSD(from, to) {
  if (from === to) return 1;

  let fromToUSD = 1;
  let usdToTarget = 1;

  if (from !== "USD") {
    fromToUSD = await fetchRate(`${from}-USD`);
  }

  if (to !== "USD") {
    usdToTarget = await fetchRate(`USD-${to}`);
  }

  return fromToUSD * usdToTarget;
}


async function convert() {
  const input = document.querySelector(".value-input input");
  const value = Number(input.value);

  if (!value || value <= 0) {
    alert("Digite um valor válido");
    return;
  }

  try {
    const rate = await getRateViaUSD(
      currencies.from.code,
      currencies.to.code
    );

    const converted = value * rate;

    document.getElementById("fromValue").textContent =
      `${currencies.from.symbol} ${value.toFixed(2)}`;

    document.getElementById("toValue").textContent =
      `${currencies.to.symbol} ${converted.toFixed(2)}`;

    document.getElementById("fromFlag").src =
      `https://flagcdn.com/w40/${currencies.from.flag}.png`;

    document.getElementById("toFlag").src =
      `https://flagcdn.com/w40/${currencies.to.flag}.png`;

    document.getElementById("resultBox").classList.remove("hidden");
  } catch (error) {
    alert("Erro ao buscar cotação");
    console.error(error);
  }
}
