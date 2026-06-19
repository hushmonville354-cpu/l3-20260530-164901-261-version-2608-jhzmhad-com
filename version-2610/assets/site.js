document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
  }

  document.querySelectorAll(".hero-carousel").forEach(function (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    if (!slides.length) return;
    let index = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });
    if (index < 0) index = 0;

    function show(nextIndex) {
      slides[index].classList.remove("is-active");
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add("is-active");
    }

    carousel.querySelectorAll("[data-hero]").forEach(function (button) {
      button.addEventListener("click", function () {
        show(index + (button.getAttribute("data-hero") === "next" ? 1 : -1));
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 6500);
  });

  document.querySelectorAll(".search-scope, main").forEach(function (scope) {
    const input = scope.querySelector(".site-search");
    if (!input) return;
    const cards = Array.from(scope.querySelectorAll(".movie-card"));
    const chips = Array.from(scope.querySelectorAll(".filter-chip"));
    let activeFilter = "";

    function apply() {
      const term = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.textContent
        ].join(" ").toLowerCase();
        const matchedTerm = !term || haystack.indexOf(term) >= 0;
        const matchedFilter = !activeFilter || haystack.indexOf(activeFilter.toLowerCase()) >= 0;
        card.classList.toggle("is-hidden", !(matchedTerm && matchedFilter));
      });
    }

    input.addEventListener("input", apply);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (item) {
          item.classList.remove("is-active");
        });
        chip.classList.add("is-active");
        activeFilter = chip.getAttribute("data-filter") || "";
        apply();
      });
    });
  });
});
