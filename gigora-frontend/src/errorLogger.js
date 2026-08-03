import { supabase } from "./supabase";

export const logError = async (error, userId = null) => {
  try {
    await supabase
      .from("error_logs")
      .insert([
        {
          error_message: error.message || String(error),
          page_url: window.location.pathname,
          browser_info: navigator.userAgent,
          user_id: userId,
        }
      ]);

  } catch (err) {
    console.error("Error logging failed:", err);
  }
};
