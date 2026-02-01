//import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://axsisintdpejgjizxewp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4c2lzaW50ZHBlamdqaXp4ZXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mzg3MDMsImV4cCI6MjA3OTQxNDcwM30.n__iyh0haHhwXthKfOhiCWTp5V1KXorsPkj1rCUjjDc";

// Create ONE shared client and attach to window so teacher.js can use it
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

//export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//  auth: {
//    persistSession: true,
//    autoRefreshToken: true,
//    detectSessionInUrl: true,
//  },
//});


// supabaseClient.js
// Requires: <script src="https://unpkg.com/@supabase/supabase-js@2"></script> loaded first

// ✅ Put your real values here:
//const SUPABASE_URL = "https://YOURPROJECT.supabase.co";
//const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";


