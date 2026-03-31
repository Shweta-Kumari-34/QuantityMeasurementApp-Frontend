// ================= AUTO REDIRECT IF ALREADY LOGGED IN =================
if (
  localStorage.getItem("isLoggedIn") === "true" ||
  sessionStorage.getItem("isLoggedIn") === "true"
) {
  window.location.href = "dashboard.html";
}

// ================= DOM =================
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const goToSignup = document.getElementById("goToSignup");
const goToLogin = document.getElementById("goToLogin");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const rememberMe = document.getElementById("rememberMe");

const fullName = document.getElementById("fullName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const mobileNumber = document.getElementById("mobileNumber");

const togglePasswordIcons = document.querySelectorAll(".toggle-password");

// ================= TAB SWITCH =================
function showLogin() {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");

  loginForm.classList.add("active");
  signupForm.classList.remove("active");
}

function showSignup() {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");

  signupForm.classList.add("active");
  loginForm.classList.remove("active");
}

loginTab.addEventListener("click", showLogin);
signupTab.addEventListener("click", showSignup);
goToSignup.addEventListener("click", showSignup);
goToLogin.addEventListener("click", showLogin);

// ================= TOGGLE PASSWORD =================
togglePasswordIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  });
});

// ================= ERROR HANDLING =================
function showError(input, message) {
  removeError(input);

  const error = document.createElement("small");
  error.className = "error-msg";
  error.innerText = message;

  input.parentElement.appendChild(error);
  input.style.borderColor = "#d62828";
}

function removeError(input) {
  if (!input || !input.parentElement) return;

  const error = input.parentElement.querySelector(".error-msg");
  if (error) {
    error.remove();
  }

  input.style.borderColor = "#d6dfef";
}

// ================= VALIDATION HELPERS =================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

function isValidPassword(password) {
  return password.length >= 6;
}

// ================= SIGNUP =================
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  [fullName, signupEmail, signupPassword, mobileNumber].forEach(removeError);

  if (fullName.value.trim() === "") {
    showError(fullName, "Full name is required");
    isValid = false;
  }

  if (signupEmail.value.trim() === "") {
    showError(signupEmail, "Email is required");
    isValid = false;
  } else if (!isValidEmail(signupEmail.value.trim())) {
    showError(signupEmail, "Enter a valid email");
    isValid = false;
  }

  if (signupPassword.value.trim() === "") {
    showError(signupPassword, "Password is required");
    isValid = false;
  } else if (!isValidPassword(signupPassword.value.trim())) {
    showError(signupPassword, "Password must be at least 6 characters");
    isValid = false;
  }

  if (mobileNumber.value.trim() === "") {
    showError(mobileNumber, "Mobile number is required");
    isValid = false;
  } else if (!isValidMobile(mobileNumber.value.trim())) {
    showError(mobileNumber, "Enter a valid 10-digit mobile number");
    isValid = false;
  }

  if (!isValid) return;

  const userData = {
    fullName: fullName.value.trim(),
    email: signupEmail.value.trim(),
    password: signupPassword.value.trim(),
    mobile: mobileNumber.value.trim(),
  };

  localStorage.setItem("registeredUser", JSON.stringify(userData));

  alert("Signup successful! Please login.");
  signupForm.reset();
  showLogin();
});

// ================= LOGIN =================
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  [loginEmail, loginPassword].forEach(removeError);

  if (loginEmail.value.trim() === "") {
    showError(loginEmail, "Email is required");
    isValid = false;
  } else if (!isValidEmail(loginEmail.value.trim())) {
    showError(loginEmail, "Enter a valid email");
    isValid = false;
  }

  if (loginPassword.value.trim() === "") {
    showError(loginPassword, "Password is required");
    isValid = false;
  }

  if (!isValid) return;

  const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

  if (!storedUser) {
    alert("No account found. Please sign up first.");
    showSignup();
    return;
  }

  if (
    loginEmail.value.trim() === storedUser.email &&
    loginPassword.value.trim() === storedUser.password
  ) {
    if (rememberMe.checked) {
      localStorage.setItem("isLoggedIn", "true");
      sessionStorage.removeItem("isLoggedIn");
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
      localStorage.removeItem("isLoggedIn");
    }

    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid email or password");
  }
});

// ================= REMOVE ERROR ON TYPING =================
[
  loginEmail,
  loginPassword,
  fullName,
  signupEmail,
  signupPassword,
  mobileNumber,
].forEach((input) => {
  input.addEventListener("input", () => removeError(input));
});