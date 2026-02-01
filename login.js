"use strict";
import { supabase } from "./supabaseClient.js";

const statusEl = document.getElementById("status");
const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

async function routeByRole(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("wordlist_role")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const role = data?.wordlist_role;
  if (role === "teacher") window.location.href = "./teacher.html";
  else if (role === "student") window.location.href = "./student.html";
  else {
    // if role isn't set, send to teacher by default (or show message)
    setStatus("Your account has no wordlist_role set. Ask admin to set teacher/student.");
  }
}

loginBtn.addEventListener("click", async () => {
  try {
    setStatus("Signing in…");
    const email = (emailEl.value || "").trim().toLowerCase();
    const password = passEl.value || "";
    if (!email || !password) return setStatus("Enter email and password.");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    await routeByRole(data.user.id);
  } catch (err) {
    console.error(err);
    setStatus(`Login failed: ${err?.message || err}`);
  }
});

// If already logged in, route immediately
(async () => {
  const { data } = await supabase.auth.getUser();
  if (data?.user?.id) {
    try {
      await routeByRole(data.user.id);
    } catch (err) {
      console.error(err);
      setStatus(`Signed in, but role check failed: ${err?.message || err}`);
    }
  }
})();
