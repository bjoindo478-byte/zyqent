document.addEventListener("DOMContentLoaded", () => {
  const config = window.ZYQENT_CONFIG || {};
  const API = (config.API_BASE_URL || "").replace(/\/+$/, "");

  const $ = id => document.getElementById(id);

  const authView = $("authView");
  const dashboardView = $("dashboardView");
  const loginPanel = $("loginPanel");
  const registerPanel = $("registerPanel");
  const notice = $("notice");

  let currentUser = null;

  function showNotice(message) {
    if (notice) notice.textContent = message;
  }

  async function apiRequest(path, options = {}) {
    if (!API) {
      throw new Error("ZYQENT API URL is not configured.");
    }

    const response = await fetch(API + path, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  }

  function showDashboard(user) {
    if (!user) {
      showNotice("Member information is unavailable.");
      return;
    }

    currentUser = user;

    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");

    $("memberName").textContent =
      user.displayName || user.email || "MEMBER";

    $("profileEmail").textContent =
      user.email || "";

    showPage("home");
    window.scrollTo(0, 0);
  }

  function showLogin() {
    currentUser = null;

    dashboardView.classList.add("hidden");
    authView.classList.remove("hidden");

    loginPanel.classList.remove("hidden");
    registerPanel.classList.add("hidden");

    $("loginForm").reset();
    $("registerForm").reset();

    showNotice("");
  }

  function showPage(page) {
    document.querySelectorAll(".page-content").forEach(section => {
      section.classList.add("hidden");
    });

    const selected = $("page-" + page);

    if (selected) {
      selected.classList.remove("hidden");
    }

    document.querySelectorAll(".nav-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });
  }

  // LOGIN

  $("loginForm").addEventListener("submit", async event => {
    event.preventDefault();

    const email = $("email").value.trim();
    const password = $("password").value;

    showNotice("CONNECTING TO ZYQENT CORE...");

    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (!result.user) {
        throw new Error("User information was not returned.");
      }

      showDashboard(result.user);

    } catch (error) {
      showNotice(error.message);
    }
  });

  // OPEN REGISTER

  $("registerLink").addEventListener("click", event => {
    event.preventDefault();

    loginPanel.classList.add("hidden");
    registerPanel.classList.remove("hidden");

    showNotice("");
  });

  // BACK TO LOGIN

  $("backToLogin").addEventListener("click", event => {
    event.preventDefault();
    showLogin();
  });

  // REGISTER

  $("registerForm").addEventListener("submit", async event => {
    event.preventDefault();

    const displayName = $("registerName").value.trim();
    const email = $("registerEmail").value.trim();
    const password = $("registerPassword").value;

    if (!displayName || !email || !password) {
      showNotice("Please complete all fields.");
      return;
    }

    if (password.length < 12) {
      showNotice("Password must contain at least 12 characters.");
      return;
    }

    showNotice("CREATING YOUR MEMBER ACCOUNT...");

    try {
      const result = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          displayName,
          email,
          password
        })
      });

      if (!result.user) {
        throw new Error(
          "Account created, but user information was not returned. Please sign in."
        );
      }

      showDashboard(result.user);

    } catch (error) {
      showNotice(error.message);
    }
  });

  // GOOGLE LOGIN

  $("googleLogin").addEventListener("click", () => {
    showNotice("GOOGLE SIGN-IN IS NOT CONFIGURED YET.");
  });

  // NAVIGATION

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      if (!currentUser) return;

      showPage(button.dataset.page);
    });
  });

  // LOGOUT

  $("logoutButton").addEventListener("click", async () => {
    const button = $("logoutButton");

    button.disabled = true;
    button.textContent = "SIGNING OUT...";

    try {
      await apiRequest("/api/auth/logout", {
        method: "POST"
      });

      showLogin();

    } catch (error) {
      showNotice(
        "Logout could not be confirmed. Please try again."
      );
    } finally {
      button.disabled = false;
      button.textContent = "SIGN OUT";
    }
  });

  // CHECK EXISTING SESSION

  showNotice("INITIALIZING ZYQENT...");

  apiRequest("/api/auth/me")
    .then(result => {
      if (result.user) {
        showDashboard(result.user);
      } else {
        showLogin();
      }
    })
    .catch(() => {
      showLogin();
    });

  console.log("ZYQENT MEMBER V2 INITIALIZED");
});
