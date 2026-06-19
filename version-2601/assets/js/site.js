(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero-slider]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-search]'));

  searchInputs.forEach(function (input) {
    var scopeSelector = input.getAttribute('data-search-scope') || 'body';
    var scope = document.querySelector(scopeSelector) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty-state]');

    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-year') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var matched = !query || text.indexOf(query) !== -1;
        card.classList.toggle('hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('visible', visible === 0);
      }
    });
  });

  function startVideo(player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-play-cover]');
    var url = player.getAttribute('data-video');

    if (!video || !url) {
      return;
    }

    if (cover) {
      cover.classList.add('hidden');
    }

    if (!player.dataset.ready) {
      player.dataset.ready = '1';

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        player.hlsInstance = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(function () {});
      } else {
        video.src = url;
        video.play().catch(function () {});
      }
    } else {
      video.play().catch(function () {});
    }
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));

  players.forEach(function (player) {
    var cover = player.querySelector('[data-play-cover]');
    var video = player.querySelector('video');

    if (cover) {
      cover.addEventListener('click', function () {
        startVideo(player);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!player.dataset.ready) {
          startVideo(player);
        }
      });
    }
  });
})();
