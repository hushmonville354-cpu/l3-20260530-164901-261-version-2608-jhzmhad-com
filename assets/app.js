(function () {
  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  function bindMenu() {
    var button = document.querySelector('.menu-button');
    var panel = document.querySelector('.mobile-panel');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      var isOpen = panel.hasAttribute('hidden');
      if (isOpen) {
        panel.removeAttribute('hidden');
        button.setAttribute('aria-expanded', 'true');
        button.textContent = '×';
      } else {
        panel.setAttribute('hidden', '');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = '☰';
      }
    });
  }

  function bindFilters() {
    var cards = toArray(document.querySelectorAll('.filter-card'));
    var keyword = document.querySelector('.filter-keyword');
    var controls = toArray(document.querySelectorAll('[data-filter]'));
    var empty = document.querySelector('.filter-empty');
    if (!cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (keyword && q) {
      keyword.value = q;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function cardText(card) {
      return [
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.tags,
        card.dataset.category
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var term = normalize(keyword ? keyword.value : '');
      var active = {};
      controls.forEach(function (control) {
        var name = control.getAttribute('data-filter');
        if (name && control.value) {
          active[name] = control.value;
        }
      });
      var shown = 0;
      cards.forEach(function (card) {
        var ok = true;
        if (term && cardText(card).indexOf(term) === -1) {
          ok = false;
        }
        Object.keys(active).forEach(function (name) {
          if (String(card.dataset[name] || '') !== String(active[name])) {
            ok = false;
          }
        });
        card.style.display = ok ? '' : 'none';
        if (ok) {
          shown += 1;
        }
      });
      if (empty) {
        empty.hidden = shown !== 0;
      }
    }

    if (keyword) {
      keyword.addEventListener('input', applyFilter);
    }
    controls.forEach(function (control) {
      control.addEventListener('change', applyFilter);
    });
    applyFilter();
  }

  function initMoviePlayer(videoId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !streamUrl) {
      return;
    }
    var shell = video.closest('.player-shell');
    var prepared = false;
    var engine = null;

    function prepare() {
      if (prepared) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        engine = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        engine.loadSource(streamUrl);
        engine.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      prepared = true;
    }

    function play() {
      prepare();
      if (shell) {
        shell.classList.add('is-playing');
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();
      play();
    });

    video.addEventListener('click', function () {
      if (!prepared || video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (shell) {
        shell.classList.add('is-playing');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (engine) {
        engine.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;

  document.addEventListener('DOMContentLoaded', function () {
    bindMenu();
    bindFilters();
  });
})();
