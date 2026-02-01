"use strict";
import { supabase } from "./supabaseClient.js";

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const msgEl = document.getElementById("msg");
const btn = document.getElementById("signupBtn");

btn.addEventListener("click", async () => {
  msgEl.textContent = "Signing up…";

  const email = (emailEl.value || "").trim().toLowerCase();
  const password = passEl.value || "";

  if (!email || !password) {
    msgEl.textContent = "Enter email and password.";
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    msgEl.textContent = `Error: ${error.message}`;
    return;
  }

  // If email confirmations are ON, user may need to confirm.
  msgEl.textContent = data?.user
    ? `Created: ${data.user.email}. (If confirmations are enabled, check email.)`
    : "Signup submitted. Check email if confirmation is required.";
});
