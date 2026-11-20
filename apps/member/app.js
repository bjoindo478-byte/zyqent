document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const config = window.ZYQENT_CONFIG || {};
  const API = (config.API_BASE_URL || "").replace(/\/+$/, "");

  const $ = id => document.getElementById(id);

  const authView = $("authView");
  const dashboardView = $("dashboardView");
  const loginPanel = $("loginPanel");
  const registerPanel = $("registerPanel");
  const notice = $("notice");

  const companion = $("zyqoCompanion");
  const zyqoToggle = $("zyqoToggle");
  const zyqoPanel = $("zyqoPanel");
  const zyqoClose = $("zyqoClose");
  const zyqoChat = $("zyqoChat");
  const zyqoForm = $("zyqoForm");
  const zyqoInput = $("zyqoInput");

  let currentUser = null;
  let requestInProgress = false;

  function showNotice(message) {
    notice.textContent = message || "";
  }

  async function apiRequest(path, options = {}) {
    if (!API) {
      throw new Error("API URL belum dikonfigurasi. Periksa config.js.");
    }

    const response = await fetch(API + path, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      throw new Error("Respons server tidak valid.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Permintaan gagal.");
    }

    return data;
  }

  function setFormBusy(form, busy) {
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = busy;
  }

  function showDashboard(user) {
    if (!user) {
      showLogin();
      return;
    }

    currentUser = user;

    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    companion.classList.remove("hidden");

    const name = user.displayName || user.name || user.email || "Member";

    $("memberNameHome").textContent = name;
    $("memberNameProfile").textContent = name;
    $("profileEmail").textContent = user.email || "";

    showPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showLogin() {
    currentUser = null;
    dashboardView.classList.add("hidden");
    authView.classList.remove("hidden");
    companion.classList.add("hidden");
    closeZyqo();

    loginPanel.classList.remove("hidden");
    registerPanel.classList.add("hidden");
    showNotice("");
  }

  function showPage(page) {
    const selected = $("page-" + page);
    if (!selected) return;

    document.querySelectorAll(".page-content").forEach(section => {
      section.classList.add("hidden");
    });

    selected.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.page === page);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openZyqo() {
    if (!currentUser) return;
    zyqoPanel.classList.remove("hidden");
    zyqoToggle.setAttribute("aria-expanded", "true");
    zyqoInput.focus();
  }

  function closeZyqo() {
    zyqoPanel.classList.add("hidden");
    zyqoToggle.setAttribute("aria-expanded", "false");
  }

  function toggleZyqo() {
    if (zyqoPanel.classList.contains("hidden")) {
      openZyqo();
    } else {
      closeZyqo();
    }
  }

  function addMessage(message, type) {
    const wrapper = document.createElement("div");
    wrapper.className = "zyqo-message " +
      (type === "user" ? "user-message" : "bot-message");

    const tag = document.createElement("span");
    tag.className = "message-tag";
    tag.textContent = type === "user" ? "YOU" : "ZYQO";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    wrapper.append(tag, paragraph);
    zyqoChat.appendChild(wrapper);
    zyqoChat.scrollTop = zyqoChat.scrollHeight;
  }

  function getZyqoReply(message) {
    const text = message.toLowerCase();

    if (/halo|hai|hello|hi\b|hey/.test(text)) {
      return "Halo! Senang bertemu denganmu. Aku ZYQO, companion digital di ZYQENT.";
    }

    if (/siapa kamu|kamu siapa|namamu|nama kamu/.test(text)) {
      return "Aku ZYQO, ZYQENT AI Companion. Aku dirancang untuk membantu menjelajahi ekosistem ZYQENT.";
    }

    if (/zyqent|website|platform/.test(text)) {
      return "ZYQENT adalah Ultimate Digital Experience, sebuah ekosistem hybrid yang menggabungkan teknologi, hiburan, pembelajaran, dan eksplorasi digital.";
    }

    if (/universe|galaxy|semesta/.test(text)) {
      return "Digital Universe adalah ruang eksplorasi ZYQENT. Buka menu UNIVERSE untuk melihat halaman dimensinya.";
    }

    if (/technology|teknologi|ai|kecerdasan/.test(text)) {
      return "Technology Center adalah pusat eksplorasi AI, inovasi digital, dan kreativitas. Kamu bisa membukanya melalui menu TECH CENTER.";
    }

    if (/world|dunia|hiburan|belajar|learning/.test(text)) {
      return "Interactive World dirancang untuk pengalaman hiburan, pembelajaran, dan penjelajahan interaktif.";
    }

    if (/profile|profil|akun/.test(text)) {
      return "Kamu bisa melihat identitas akun melalui menu PROFILE. Di sana juga tersedia tombol Sign Out.";
    }

    if (/bantuan|help|fitur|menu/.test(text)) {
      return "Aku bisa menjelaskan ZYQENT, Universe, Technology Center, Interactive World, dan Profile. Pilih tombol cepat di bawah atau tulis pertanyaanmu.";
    }

    if (/terima kasih|makasih|thanks/.test(text)) {
      return "Sama-sama! Semoga pengalamanmu menjelajahi ZYQENT menyenangkan.";
    }

    return "Aku masih dalam tahap prototype, jadi kemampuanku terbatas pada informasi dasar ZYQENT. Coba tanyakan tentang Universe, Technology Center, Interactive World, atau Profile.";
  }

  function sendZyqoMessage(message) {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    addMessage(cleanMessage, "user");
    zyqoInput.value = "";

    const reply = getZyqoReply(cleanMessage);

    window.setTimeout(() => {
      addMessage(reply, "bot");
    }, 350);
  }

  // LOGIN
  $("loginForm").addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;
    if (requestInProgress) return;

    const email = $("email").value.trim();
    const password = $("password").value;

    requestInProgress = true;
    setFormBusy(form, true);
    showNotice("Signing in...");

    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      showDashboard(result.user);
      form.reset();
    } catch (error) {
      showNotice(error.message);
    } finally {
      requestInProgress = false;
      setFormBusy(form, false);
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

    const form = event.currentTarget;
    if (requestInProgress) return;

    const displayName = $("registerName").value.trim();
    const email = $("registerEmail").value.trim();
    const password = $("registerPassword").value;

    if (password.length < 12) {
      showNotice("Password must contain at least 12 characters.");
      return;
    }

    requestInProgress = true;
    setFormBusy(form, true);
    showNotice("Creating your account...");

    try {
      const result = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, displayName, password })
      });

      showDashboard(result.user);
      form.reset();
    } catch (error) {
      showNotice(error.message);
    } finally {
      requestInProgress = false;
      setFormBusy(form, false);
    }
  });

  // GOOGLE SIGN-IN PLACEHOLDER
  $("googleLogin").addEventListener("click", () => {
    showNotice("Google Sign-In is not configured yet.");
  });

  // NAVIGATION
  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  // LOGOUT
  $("logoutButton").addEventListener("click", async () => {
    const button = $("logoutButton");
    button.disabled = true;

    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      button.disabled = false;
      showLogin();
    }
  });

  // ZYQO COMPANION
  zyqoToggle.addEventListener("click", toggleZyqo);
  zyqoClose.addEventListener("click", closeZyqo);

  zyqoForm.addEventListener("submit", event => {
    event.preventDefault();
    sendZyqoMessage(zyqoInput.value);
  });

  document.querySelectorAll("[data-zyqo]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.zyqo;

      const actions = {
        explore: {
          page: "universe",
          message: "Ayo jelajahi Digital Universe! Halaman Universe sudah dibuka."
        },
        technology: {
          page: "technology",
          message: "Technology Center sudah dibuka. Jelajahi teknologi dan inovasi digital!"
        },
        about: {
          page: "home",
          message: "ZYQENT adalah ekosistem digital hybrid untuk teknologi, hiburan, pembelajaran, dan eksplorasi."
        }
      };

      const selected = actions[action];
      if (!selected) return;

      showPage(selected.page);
      openZyqo();
      addMessage(button.textContent.trim(), "user");

      window.setTimeout(() => {
        addMessage(selected.message, "bot");
      }, 250);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeZyqo();
  });

  // RESTORE SESSION
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

  console.log("ZYQENT Member System Initialized");
});
