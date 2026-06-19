(function() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      menu.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const filterInput = document.querySelector('[data-filter-input]');
  if (q && filterInput) {
    filterInput.value = q;
  }

  const filterList = document.querySelector('[data-filter-list]');
  const yearFilter = document.querySelector('[data-filter-year]');

  function runFilter() {
    if (!filterList) {
      return;
    }
    const term = filterInput ? filterInput.value.trim().toLowerCase() : '';
    const year = yearFilter ? yearFilter.value : '';
    const items = Array.from(filterList.children);
    items.forEach(function(item) {
      const text = [
        item.getAttribute('data-title'),
        item.getAttribute('data-year'),
        item.getAttribute('data-region'),
        item.getAttribute('data-type'),
        item.getAttribute('data-genre'),
        item.textContent
      ].join(' ').toLowerCase();
      const yearMatch = !year || text.indexOf(year) !== -1;
      const termMatch = !term || text.indexOf(term) !== -1;
      item.classList.toggle('hidden-by-filter', !(yearMatch && termMatch));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', runFilter);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', runFilter);
  }
  runFilter();
})();
