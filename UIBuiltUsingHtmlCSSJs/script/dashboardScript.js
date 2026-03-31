// ================= LOGIN CHECK =================
if (
  localStorage.getItem("isLoggedIn") !== "true" &&
  sessionStorage.getItem("isLoggedIn") !== "true"
) {
  window.location.href = "loginForm.html";
}

// ================= UNIT MAP =================
const units = {
  length: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
  weight: ["KILOGRAM", "GRAM", "POUND"],
  volume: ["LITRE", "MILLILITRE", "GALLON"],
  temperature: ["C", "F", "K"],
};

// ================= DOM =================
const typeButtons = document.querySelectorAll(".type");
const actionButtons = document.querySelectorAll(".action");

const unit1 = document.getElementById("unit1");
const unit2 = document.getElementById("unit2");

const value1 = document.getElementById("value1");
const value2 = document.getElementById("value2");

const operatorBox = document.getElementById("operatorBox");
const value2Box = document.getElementById("value2Box");

const calculateBtn = document.getElementById("calculateBtn");
const resultText = document.getElementById("resultText");

// ================= STATE =================
let currentType = "length";
let currentAction = "compare";

// ================= INIT =================
updateUnits();
updateUI();

// ================= TYPE SWITCH =================
typeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const activeType = document.querySelector(".type.active");
    if (activeType) {
      activeType.classList.remove("active");
    }

    btn.classList.add("active");
    currentType = btn.dataset.type;

    updateUnits();

    const arithmeticBtn = document.querySelector('[data-action="arithmetic"]');

    if (currentType === "temperature") {
      arithmeticBtn.disabled = true;
      arithmeticBtn.style.opacity = "0.5";
      arithmeticBtn.style.cursor = "not-allowed";

      if (currentAction === "arithmetic") {
        document.querySelector('[data-action="convert"]').click();
      }
    } else {
      arithmeticBtn.disabled = false;
      arithmeticBtn.style.opacity = "1";
      arithmeticBtn.style.cursor = "pointer";
    }
  });
});

// ================= ACTION SWITCH =================
actionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.disabled) return;

    const activeAction = document.querySelector(".action.active");
    if (activeAction) {
      activeAction.classList.remove("active");
    }

    btn.classList.add("active");
    currentAction = btn.dataset.action;

    updateUI();
  });
});

// ================= UPDATE UI =================
function updateUI() {
  if (currentAction === "convert") {
    value2Box.style.display = "flex";
    value2.style.display = "none";
    operatorBox.style.display = "none";
  } else if (currentAction === "compare") {
    value2Box.style.display = "flex";
    value2.style.display = "block";
    operatorBox.style.display = "none";
  } else if (currentAction === "arithmetic") {
    value2Box.style.display = "flex";
    value2.style.display = "block";
    operatorBox.style.display = "block";
    operatorBox.innerText = "+";
  }
}

// ================= UPDATE UNITS =================
function updateUnits() {
  const list = units[currentType];

  unit1.innerHTML = "";
  unit2.innerHTML = "";

  list.forEach((u) => {
    unit1.innerHTML += `<option value="${u}">${u}</option>`;
    unit2.innerHTML += `<option value="${u}">${u}</option>`;
  });
}

// ================= CALCULATE =================
calculateBtn.addEventListener("click", () => {
  const v1 = parseFloat(value1.value);
  const v2 = parseFloat(value2.value);

  const u1 = unit1.value;
  const u2 = unit2.value;

  if (isNaN(v1)) {
    alert("Enter Value 1");
    return;
  }

  let result;

  if (currentAction === "convert") {
    result = convert(v1, u1, u2);
  } else if (currentAction === "compare") {
    if (isNaN(v2)) {
      alert("Enter Value 2");
      return;
    }
    result = compare(v1, u1, v2, u2);
  } else if (currentAction === "arithmetic") {
    if (isNaN(v2)) {
      alert("Enter Value 2");
      return;
    }
    result = arithmetic(v1, u1, v2, u2);
  }

  resultText.innerText = result;
});

// ================= TEMP LOGIC =================
function convert(v1, u1, u2) {
  return `${v1} ${u1} → ${u2}`;
}

function compare(v1, u1, v2, u2) {
  if (v1 === v2 && u1 === u2) {
    return "Equal";
  }
  return v1 > v2 ? "Greater" : "Smaller";
}

function arithmetic(v1, u1, v2, u2) {
  return `${v1 + v2} ${u1}`;
}

// ================= LOGOUT =================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = "loginForm.html";
});