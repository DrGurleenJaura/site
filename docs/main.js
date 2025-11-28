// main.js – mobile nav + active link

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // Set active nav item based on current path
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll("a[data-nav]");

  links.forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });
});
