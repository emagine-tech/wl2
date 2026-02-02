/*************************************************
 * Login – WordList App
 * GLOBAL (non-module) version
 *************************************************/

console.log("login.js loaded");

const supabaseClient = window.supabaseClient;
if (!supabaseClient) {
  throw new Error("supabaseClient not initialized");
}

/* ========= DOM ========= */
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const status = document.getElementById("status");

/* ========= LOGIN ========= */
loginBtn.addEventListener("click", async () => {
  status.textContent = "Signing in…";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(error);
    status.textContent = error.message;
    return;
  }

  window.location.href = "./teacher.html";
});

/* ========= SIGN UP ========= */
signupBtn.addEventListener("click", async () => {
  status.textContent = "Creating account…";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error(error);
    status.textContent = error.message;
    return;
  }

  status.textContent = "Account created. You can now log in.";
});
