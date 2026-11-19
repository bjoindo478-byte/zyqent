// =====================================
// ZYQENT MEMBER WEBSITE
// Main Application Script
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const googleLogin = document.getElementById("googleLogin");
  const registerLink = document.getElementById("registerLink");
  const notice = document.getElementById("notice");

  // Display system notification
  function showNotice(message) {
    if (notice) {
      notice.textContent = message;
    }
  }

  // Email and password login
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        showNotice("Please complete all login fields.");
        return;
      }

      showNotice(
        "Authentication API is not connected yet. Please try again later."
      );
    });
  }

  // Google sign-in
  if (googleLogin) {
    googleLogin.addEventListener("click", () => {
      showNotice(
        "Google authentication will be available after secure API integration."
      );
    });
  }

  // Member registration
  if (registerLink) {
    registerLink.addEventListener("click", (event) => {
      event.preventDefault();

      showNotice(
        "Member registration will be available soon."
      );
    });
  }

  console.log("ZYQENT Member System Initialized");
});
