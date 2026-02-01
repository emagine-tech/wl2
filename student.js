"use strict";
import { supabase } from "./supabaseClient.js";

const authStatus = document.getElementById("authStatus");
const logoutBtn = document.getElementById("logoutBtn");
const loginLink = document.getElementById("loginLink");

const wordListEl = document.getElementById("wordList");
const assignmentMetaEl = document.getElementById("assignmentMeta");

function setAuthUi({ loggedIn, email } = {}) {
  if (!authStatus) return;
  if (!loggedIn) {
    authStatus.textContent = "Not logged in.";
    loginLink?.classList.remove("hidden");
    logoutBtn?.classList.add("hidden");
    return;
  }
  authStatus.textContent = `Logged in as ${email}`;
  loginLink?.classList.add("hidden");
  logoutBtn?.classList.remove("hidden");
}

async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    setAuthUi({ loggedIn: false });
    window.location.href = "./login.html";
    throw new Error("Not logged in");
  }
  setAuthUi({ loggedIn: true, email: data.user.email });
  return data.user;
}

async function requireStudentRole(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("wordlist_role")
    .eq("id", userId)
    .single();

  if (error) throw error;
  if (data?.wordlist_role !== "student") {
    window.location.href = "./teacher.html";
    throw new Error("Not a student");
  }
}

logoutBtn?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  setAuthUi({ loggedIn: false });
  window.location.href = "./login.html";
});

function renderWordlist(words) {
  wordListEl.innerHTML = "";
  if (!words?.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No assignment yet.";
    wordListEl.appendChild(li);
    return;
  }
  words.forEach(w => {
    const li = document.createElement("li");
    li.textContent = w;
    wordListEl.appendChild(li);
  });
}

async function loadLatestAssignment(studentId) {
  const { data, error } = await supabase
    .from("assignments")
    .select(`
      id,
      assigned_at,
      wordlists (
        id,
        title,
        words
      )
    `)
    .eq("student_id", studentId)
    .order("assigned_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    renderWordlist([]);
    if (assignmentMetaEl) assignmentMetaEl.textContent = "";
    return;
  }

  renderWordlist(data?.wordlists?.words || []);
  if (assignmentMetaEl) {
    assignmentMetaEl.textContent = `Assigned: ${new Date(data.assigned_at).toLocaleString()}`;
  }
}

(async function init() {
  const user = await requireUser();
  await requireStudentRole(user.id);
  await loadLatestAssignment(user.id);
})();
