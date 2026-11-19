/* =================================
   ZYQENT ADMIN APPLICATION
   ================================= */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm");
  const notice = document.getElementById("adminNotice");

  function showNotice(message) {
    if (notice) {
      notice.textContent = message;
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document
        .getElementById("adminEmail")
        .value.trim();

      const password = document
        .getElementById("adminPassword")
        .value;

      if (!email || !password) {
        showNotice("Please complete all fields.");
        return;
      }

      showNotice(
        "Admin authentication API is not connected yet."
      );

      loginForm.reset();
    });
  }

  console.log("ZYQENT Admin initialized.");
});
