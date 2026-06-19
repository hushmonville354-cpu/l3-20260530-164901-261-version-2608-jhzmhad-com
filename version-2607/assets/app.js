(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-hero-target]'));
  var current = 0;
  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    thumbs.forEach(function (thumb, i) {
      thumb.classList.toggle('active', i === current);
    });
  }
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      showSlide(Number(thumb.getAttribute('data-hero-target')) || 0);
    });
  });
  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var queryInput = document.querySelector('[data-page-filter]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-grid .movie-card'));

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applyUrlQuery() {
    var target = document.querySelector('[data-url-query]');
    if (!target) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var value = params.get('q') || '';
    if (value) {
      target.value = value;
    }
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }
    var q = normalize(queryInput ? queryInput.value : '');
    var year = yearFilter ? yearFilter.value : '';
    var type = typeFilter ? typeFilter.value : '';
    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var okQuery = !q || text.indexOf(q) !== -1;
      var okYear = !year || card.getAttribute('data-year') === year;
      var okType = !type || card.getAttribute('data-type') === type;
      card.classList.toggle('is-hidden', !(okQuery && okYear && okType));
    });
  }

  applyUrlQuery();
  if (queryInput) {
    queryInput.addEventListener('input', filterCards);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', filterCards);
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', filterCards);
  }
  filterCards();
})();
