(function () {
  "use strict";

  const header = document.querySelector("#header");
  const headerToggleBtn = document.querySelector(".header-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function headerToggle() {
    const open = header.classList.toggle("header-show");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
    headerToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    headerToggleBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  headerToggleBtn.addEventListener("click", headerToggle);

  document.querySelectorAll("#navmenu a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (header.classList.contains("header-show")) {
        headerToggle();
      }
    });
  });

  const scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    scrollTop.classList.toggle("is-visible", window.scrollY > 100);
  }

  scrollTop.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  if (reduceMotion || typeof AOS === "undefined") {
    document.documentElement.classList.add("no-aos");
  } else {
    AOS.init({
      duration: 550,
      easing: "ease-out",
      once: true,
      offset: 24
    });
  }

  const typedEl = document.querySelector(".typed");
  if (typedEl && !reduceMotion && typeof Typed !== "undefined") {
    new Typed(".typed", {
      strings: typedEl.getAttribute("data-typed-items").split(",").map(function (item) {
        return item.trim();
      }),
      loop: true,
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 1800
    });
  }

  const filterButtons = document.querySelectorAll(".work-filters [data-filter]");
  const workCards = document.querySelectorAll("#work-grid [data-group]");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter");
      filterButtons.forEach(function (item) {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      workCards.forEach(function (card) {
        const show = filter === "all" || card.getAttribute("data-group") === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  const navLinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    const position = window.scrollY + 160;
    let current = null;
    document.querySelectorAll("main section[id]").forEach(function (section) {
      if (position >= section.offsetTop && position < section.offsetTop + section.offsetHeight) {
        current = section.id;
      }
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = "contact";
    }
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.hash === "#" + current);
    });
  }

  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();
