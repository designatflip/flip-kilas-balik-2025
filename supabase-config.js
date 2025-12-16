// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Store the Supabase library
const supabaseLib = window.supabase;

// Initialize Supabase client and make it globally available
window.supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
