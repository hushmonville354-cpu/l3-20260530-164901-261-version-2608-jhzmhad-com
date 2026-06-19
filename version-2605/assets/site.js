(function () {
  var header = document.querySelector('[data-header]');
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');

  function updateHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > 48);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (navToggle && navLinks && header) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      header.classList.toggle('is-open', navLinks.classList.contains('is-open'));
    });
  }

  document.querySelectorAll('[data-fallback-image]').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-missing');
    }, { once: true });
  });

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function start() {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (!timer) {
        return;
      }
      window.clearInterval(timer);
      timer = null;
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = Number(dot.getAttribute('data-hero-dot') || 0);
        show(target);
        stop();
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var scope = panel.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card-list] [data-title]'));
    var searchInput = panel.querySelector('[data-local-search]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var regionSelect = panel.querySelector('[data-filter-region]');
    var categorySelect = panel.querySelector('[data-filter-category]');
    var resetButton = panel.querySelector('[data-filter-reset]');
    var countNode = panel.querySelector('[data-filter-count]');

    function matchesYear(card, value) {
      if (!value) {
        return true;
      }
      var year = card.getAttribute('data-year') || '';
      if (value === '1990') {
        return /^199/.test(year);
      }
      return year.indexOf(value) !== -1;
    }

    function apply() {
      var q = (searchInput && searchInput.value || '').trim().toLowerCase();
      var year = yearSelect && yearSelect.value || '';
      var region = regionSelect && regionSelect.value || '';
      var category = categorySelect && categorySelect.value || '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-category') || ''
        ].join(' ').toLowerCase();
        var ok = true;
        ok = ok && (!q || haystack.indexOf(q) !== -1);
        ok = ok && matchesYear(card, year);
        ok = ok && (!region || haystack.indexOf(region.toLowerCase()) !== -1);
        ok = ok && (!category || haystack.indexOf(category.toLowerCase()) !== -1);
        card.classList.toggle('hidden-by-filter', !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 部影片';
      }
    }

    [searchInput, yearSelect, regionSelect, categorySelect].forEach(function (node) {
      if (node) {
        node.addEventListener('input', apply);
        node.addEventListener('change', apply);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (yearSelect) yearSelect.value = '';
        if (regionSelect) regionSelect.value = '';
        if (categorySelect) categorySelect.value = '';
        apply();
      });
    }

    apply();
  });

  document.querySelectorAll('[data-scroll-player]').forEach(function (button) {
    button.addEventListener('click', function () {
      var player = document.querySelector('[data-player]');
      if (!player) {
        return;
      }
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var start = player.querySelector('[data-player-start]');
      if (start) {
        window.setTimeout(function () {
          start.click();
        }, 260);
      }
    });
  });
}());
