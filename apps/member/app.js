document.addEventListener("DOMContentLoaded", () => {
  const config = window.ZYQENT_CONFIG || {};
  const API = (config.API_BASE_URL || "").replace(/\/+$/, "");

  const authView = document.getElementById("authView");
  const dashboardView = document.getElementById("dashboardView");
  const loginPanel = document.getElementById("loginPanel");
  const registerPanel = document.getElementById("registerPanel");
  const notice = document.getElementById("notice");

  function showNotice(message) {
    notice.textContent = message;
  }

  async function apiRequest(path, options = {}) {
    if (!API) throw new Error("API URL belum dikonfigurasi.");

    const response = await fetch(API + path, {
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

  function showDashboard(user) {
    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");

    const name = user.displayName || user.email || "Member";

    document.getElementById("memberName").textContent = name;
    document.getElementById("profileEmail").textContent =
      user.email || "";

    showPage("home");
    window.scrollTo(0, 0);
  }

  function showLogin() {
    dashboardView.classList.add("hidden");
    authView.classList.remove("hidden");
    loginPanel.classList.remove("hidden");
    registerPanel.classList.add("hidden");
    showNotice("");
  }

  function showPage(page) {
    document.querySelectorAll(".page-content").forEach(section => {
      section.classList.add("hidden");
    });

    const selected = document.getElementById("page-" + page);
    if (selected) selected.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });
  }

  document.getElementById("loginForm").addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      showNotice("Signing in...");

      try {
        const result = await apiRequest("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        showDashboard(result.user);
      } catch (error) {
        showNotice(error.message);
      }
    }
  );

  document.getElementById("registerLink").addEventListener(
    "click",
    event => {
      event.preventDefault();
      loginPanel.classList.add("hidden");
      registerPanel.classList.remove("hidden");
      showNotice("");
    }
  );

  document.getElementById("backToLogin").addEventListener(
    "click",
    event => {
      event.preventDefault();
      showLogin();
    }
  );

  document.getElementById("registerForm").addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      const displayName =
        document.getElementById("registerName").value.trim();

      const email =
        document.getElementById("registerEmail").value.trim();

      const password =
        document.getElementById("registerPassword").value;

      if (password.length < 12) {
        showNotice("Password must contain at least 12 characters.");
        return;
      }

      showNotice("Creating your account...");

      try {
        const result = await apiRequest("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, displayName, password })
        });

        showDashboard(result.user);
      } catch (error) {
        showNotice(error.message);
      }
    }
  );

  document.getElementById("googleLogin").addEventListener(
    "click",
    () => {
      showNotice("Google Sign-In is not configured yet.");
    }
  );

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  document.getElementById("logoutButton").addEventListener(
    "click",
    async () => {
      try {
        await apiRequest("/api/auth/logout", {
          method: "POST"
        });
      } catch (error) {
        console.error("Logout request failed:", error);
      }

      showLogin();
    }
  );

  apiRequest("/api/auth/me")
    .then(result => {
      showDashboard(result.user);
    })
    .catch(() => {
      showLogin();
    });

  console.log("ZYQENT Member System Initialized");
});
