function normalizeText(value) {
  return (value || "").toString().toLowerCase().trim();
}

function setupNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) {
    return;
  }
  toggle.addEventListener("click", () => {
    links.classList.toggle("is-open");
  });
}

function setupHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  const prev = hero.querySelector("[data-hero-prev]");
  const next = hero.querySelector("[data-hero-next]");
  let index = 0;
  let timer = null;

  const setSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, current) => {
      slide.classList.toggle("is-active", current === index);
    });
    dots.forEach((dot, current) => {
      dot.classList.toggle("is-active", current === index);
    });
  };

  const restart = () => {
    if (timer) {
      window.clearInterval(timer);
    }
    timer = window.setInterval(() => setSlide(index + 1), 5000);
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setSlide(Number(dot.dataset.heroDot));
      restart();
    });
  });
  if (prev) {
    prev.addEventListener("click", () => {
      setSlide(index - 1);
      restart();
    });
  }
  if (next) {
    next.addEventListener("click", () => {
      setSlide(index + 1);
      restart();
    });
  }
  restart();
}

function setupHomeSearch() {
  const form = document.querySelector("[data-home-search]");
  if (!form) {
    return;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input[name='q']");
    const query = input ? input.value.trim() : "";
    const target = query ? `./movies.html?q=${encodeURIComponent(query)}` : "./movies.html";
    window.location.href = target;
  });
}

function setupCatalogFilters() {
  const container = document.querySelector("[data-card-container]");
  const form = document.querySelector("[data-filter-form]");
  if (!container || !form) {
    return;
  }
  const cards = Array.from(container.querySelectorAll(".searchable-card"));
  const searchInput = form.querySelector("[data-filter-search]");
  const typeSelect = form.querySelector("[data-filter-type]");
  const yearSelect = form.querySelector("[data-filter-year]");
  const genreInput = form.querySelector("[data-filter-genre]");
  const emptyState = document.querySelector("[data-empty-state]");
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  const apply = () => {
    const query = normalizeText(searchInput ? searchInput.value : "");
    const type = normalizeText(typeSelect ? typeSelect.value : "");
    const year = normalizeText(yearSelect ? yearSelect.value : "");
    const genre = normalizeText(genreInput ? genreInput.value : "");
    let visible = 0;

    cards.forEach((card) => {
      const text = normalizeText([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags,
      ].join(" "));
      const matchesQuery = !query || text.includes(query);
      const matchesType = !type || normalizeText(card.dataset.type).includes(type);
      const matchesYear = !year || normalizeText(card.dataset.year) === year;
      const matchesGenre = !genre || normalizeText(card.dataset.genre + " " + card.dataset.tags).includes(genre);
      const matches = matchesQuery && matchesType && matchesYear && matchesGenre;
      card.hidden = !matches;
      if (matches) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  };

  form.addEventListener("input", apply);
  form.addEventListener("change", apply);
  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupHero();
  setupHomeSearch();
  setupCatalogFilters();
});
