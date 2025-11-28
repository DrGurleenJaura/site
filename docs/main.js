// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    mainNav.classList.toggle("open");
  });

  // Close nav when a link is clicked (on mobile)
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      mainNav.classList.remove("open");
    });
  });
}

// Simple scroll-in animation
const animatedSections = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window && animatedSections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  animatedSections.forEach((el) => observer.observe(el));
} else {
  // fallback: just show everything
  animatedSections.forEach((el) => el.classList.add("is-visible"));
}
