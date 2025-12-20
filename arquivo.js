let currencies = {
  from: {
    code: "br",
    name: "Real Brasileiro",
    symbol: "R$",
    rate: 1,
  },
  to: {
    code: "eu",
    name: "Euro",
    symbol: "€",
    rate: 5.6,
  },
};

let currentTarget = null;
const currencyList = document.getElementById("currencyList");

function openList(element, target) {
  currentTarget = target;

  // fecha antes de mover
  currencyList.style.display = "none";

  // move a lista para o bloco clicado
  element.parentElement.appendChild(currencyList);

  currencyList.style.display = "block";
}

function selectCurrency(code, name, symbol, rate) {
  currencies[currentTarget] = { code, name, symbol, rate };

  const box = document.querySelector(`#${currentTarget} .currency-select`);
  box.innerHTML = `
    <img class="flag" src="https://flagcdn.com/w40/${code}.png">
    <span>${name}</span>
  `;

  currencyList.style.display = "none";

  if (currentTarget === "from") {
    document.getElementById("currencySymbol").textContent = symbol;
  }
   convert()
}

function swapCurrencies() {
  const temp = currencies.from;
  currencies.from = currencies.to;
  currencies.to = temp;

  document.querySelector("#from .currency-select").innerHTML = `
    <img class="flag" src="https://flagcdn.com/w40/${currencies.from.code}.png">
    <span>${currencies.from.name}</span>
  `;

  document.querySelector("#to .currency-select").innerHTML = `
    <img class="flag" src="https://flagcdn.com/w40/${currencies.to.code}.png">
    <span>${currencies.to.name}</span>
  `;

  document.getElementById("currencySymbol").textContent =
    currencies.from.symbol;
    convert()
}

function convert() {
  const input = document.querySelector(".value-input input");
  const value = Number(input.value);

  if (!value || value <= 0) {
    alert("Digite um valor válido");
    return;
  }

  const from = currencies.from;
  const to = currencies.to;

  // Conversão baseada na taxa relativa
  const valueInBase = value * from.rate;
  const converted = valueInBase / to.rate;

  document.getElementById("fromValue").textContent = `${
    from.symbol
  } ${value.toFixed(2)}`;

  document.getElementById("toValue").textContent = `${
    to.symbol
  } ${converted.toFixed(2)}`;

  document.getElementById(
    "fromFlag"
  ).src = `https://flagcdn.com/w40/${from.code}.png`;

  document.getElementById(
    "toFlag"
  ).src = `https://flagcdn.com/w40/${to.code}.png`;

  document.getElementById("resultBox").classList.remove("hidden");
}