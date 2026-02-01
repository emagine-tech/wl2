/*************************************************
 * Teacher Dashboard – WordList App
 * FINAL, de-duplicated version
 *************************************************/
const supabaseClient = window.supabaseClient;
if (!supabaseClient) {
  throw new Error("supabaseClient not initialized. Check supabaseClient.js loading order.");
}

console.log("teacher.js loaded");

/* ========= CONFIG ========= */
const AI_ENDPOINT = "https://api.elevatelearning.tech/generate";

/* ========= DOM ========= */
const authStatus = document.getElementById("authStatus");
const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");

const phonemeInput = document.getElementById("phonemeInput");
const generateBtn = document.getElementById("generateBtn");
const wordList = document.getElementById("wordList");

/* ========= AUTH ========= */
async function checkTeacherLogin() {
  console.log("Checking login…");

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Auth error:", error);
    authStatus.textContent = "Authentication error.";
    return;
  }

  if (!data.session) {
    console.log("No session");
    authStatus.textContent = "Not logged in";
    loginLink.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    return;
  }

  console.log("Logged in as:", data.session.user.email);
  authStatus.textContent = `Logged in as ${data.session.user.email}`;
  loginLink.classList.add("hidden");
  logoutBtn.classList.remove("hidden");
}

/* ========= LOGOUT ========= */
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "./login.html";
});

/* ========= AI RESPONSE NORMALIZATION ========= */
function normalizeWordsFromApi(data) {
  if (Array.isArray(data?.words)) {
    return data.words.map(w => String(w).trim()).filter(Boolean);
  }

  const text = String(data?.response ?? data?.raw ?? "").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed.words)) {
      return parsed.words.map(w => String(w).trim()).filter(Boolean);
    }
  } catch (_) {}

  return [...new Set(
    text
      .split(/[\n,;]+/)
      .map(s => s.replace(/^[-•*\s]+/, "").trim())
      .filter(s => /^[A-Za-z']{2,}$/.test(s))
      .map(s => s.toLowerCase())
  )];
}

/* ========= AI GENERATION ========= */
async function generateFromAi(phonemes) {
  const phonemeStr = Array.isArray(phonemes)
    ? phonemes.join(" ").trim()
    : String(phonemes ?? "").trim();

  if (!phonemeStr) {
    throw new Error("Phoneme is required.");
  }

  const res = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phoneme: phonemeStr,
      max_words: 20
    })
  });

  const data = await res.json();
  const words = normalizeWordsFromApi(data);

  if (!words.length) {
    console.error("AI returned no words:", data);
    throw new Error("AI returned no words.");
  }

  return words;
}

/* ========= UI ========= */
function renderWords(words) {
  wordList.innerHTML = "";
  words.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    wordList.appendChild(li);
  });
}

/* ========= EVENTS ========= */
generateBtn.addEventListener("click", async () => {
  try {
    authStatus.textContent = "Generating… please wait";
    const words = await generateFromAi(phonemeInput.value);
    renderWords(words);
    authStatus.textContent = "Done";
  } catch (err) {
    console.error(err);
    authStatus.textContent = err.message || "Generation failed.";
  }
});

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  checkTeacherLogin();
});
