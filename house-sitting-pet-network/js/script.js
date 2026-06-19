// Theme Setup
const root = document.documentElement;
const savedTheme = localStorage.getItem("pawstay-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Apply saved theme or system preference
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  root.classList.add("dark");
}

// Update theme toggle button icons
function syncThemeButtons() {
  const isDark = root.classList.contains("dark");

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    button.innerHTML = isDark
      ? '<i class="bi bi-sun-fill" aria-hidden="true"></i>'
      : '<i class="bi bi-moon-stars-fill" aria-hidden="true"></i>';
  });
}

// Theme Toggle Event
document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    root.classList.toggle("dark");

    localStorage.setItem(
      "pawstay-theme",
      root.classList.contains("dark") ? "dark" : "light"
    );

    syncThemeButtons();
  });
});

// Initialize theme button state
syncThemeButtons();


// Mobile Menu Toggle
const mobileMenuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.toggle("hidden");

    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  });
}


// Active Navigation Highlight
document.querySelectorAll("[data-current-page]").forEach((link) => {
  const currentPage = document.body.dataset.page;

  if (link.dataset.currentPage === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});


// Reveal Animation on Scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

// Observe all reveal elements
document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});


// Form Status Message Handler
function showStatus(form, message, type = "success") {
  const status = form.querySelector("[data-form-status]");

  if (!status) return;

  status.className =
    type === "success"
      ? "mt-3 fw-bold text-success"
      : "mt-3 fw-bold text-danger";

  status.textContent = message;
}


// Email Validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// Form Submission Handler
document.querySelectorAll("[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = Array.from(
      form.querySelectorAll("[required]")
    );

    const missing = requiredFields.find(
      (field) => !field.value.trim()
    );

    const emailField = form.querySelector('input[type="email"]');

    // Check required fields
    if (missing) {
      missing.focus();
      showStatus(
        form,
        "Please complete the highlighted field before sending.",
        "error"
      );
      return;
    }

    // Validate email if present
    if (emailField && !validateEmail(emailField.value.trim())) {
      emailField.focus();
      showStatus(
        form,
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    // Reset form and show success
    form.reset();
    showStatus(
      form,
      "Thanks. Your request has been received and our team will be in touch shortly."
    );
  });
});