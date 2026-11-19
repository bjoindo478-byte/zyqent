document.addEventListener("DOMContentLoaded", () => {
  const config = window.ZYQENT_CONFIG || {};
  const API = (config.API_BASE_URL || "").replace(/\/+$/, "");

  const loginForm = document.getElementById("loginForm");
  const googleLogin = document.getElementById("googleLogin");
  const registerLink = document.getElementById("registerLink");
  const notice = document.getElementById("notice");

  function showNotice(message) {
    if (notice) notice.textContent = message;
  }

  async function apiRequest(path, options = {}) {
    if (!API) throw new Error("API URL belum dikonfigurasi.");

    const response = await fetch(`${API}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Permintaan gagal.");
    }

    return data;
  }

  // Member login
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value;

      if (!email || !password) {
        showNotice("Please complete all login fields.");
        return;
      }

      showNotice("Signing in...");

      try {
        const result = await apiRequest("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        showNotice(`Welcome, ${result.user.displayName || result.user.email}!`);
        loginForm.reset();

        document.dispatchEvent(
          new CustomEvent("zyqent:login", { detail: result.user })
        );
      } catch (error) {
        showNotice(error.message);
      }
    });
  }

  // Member registration
  if (registerLink) {
    registerLink.addEventListener("click", async (event) => {
      event.preventDefault();

      const email = prompt("Enter your email address:");
      if (!email) return;

      const displayName = prompt("Enter your display name:") || "";
      const password = prompt("Create a password (minimum 12 characters):");

      if (!password) return;

      showNotice("Creating your account...");

      try {
        const result = await apiRequest("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            displayName,
            password
          })
        });

        showNotice("Your ZYQENT Member account has been created!");

        document.dispatchEvent(
          new CustomEvent("zyqent:login", { detail: result.user })
        );
      } catch (error) {
        showNotice(error.message);
      }
    });
  }

  // Google login is not connected yet
  if (googleLogin) {
    googleLogin.addEventListener("click", () => {
      showNotice("Google Sign-In is not configured yet.");
    });
  }

  // Check existing session
  apiRequest("/api/auth/me")
    .then(result => {
      showNotice(`Welcome back, ${result.user.displayName || result.user.email}!`);
      document.dispatchEvent(
        new CustomEvent("zyqent:login", { detail: result.user })
      );
    })
    .catch(() => {
      console.log("No active ZYQENT Member session.");
    });

  console.log("ZYQENT Member System Initialized");
});
