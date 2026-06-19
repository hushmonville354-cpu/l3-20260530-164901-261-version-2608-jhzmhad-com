(function () {
  function sourceOf(video) {
    var source = video.querySelector('source');
    return source ? source.getAttribute('src') : video.currentSrc || video.src;
  }

  function prepare(video) {
    var src = sourceOf(video);
    if (!src || video.getAttribute('data-ready') === '1') {
      return;
    }
    video.setAttribute('data-ready', '1');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      video._hls = hls;
    }
  }

  function start(video, button) {
    prepare(video);
    var play = video.play();
    if (play && typeof play.then === 'function') {
      play.then(function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      }).catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    } else if (button) {
      button.classList.add('is-hidden');
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-panel');
    if (!video) {
      return;
    }
    prepare(video);
    if (button) {
      button.addEventListener('click', function () {
        start(video, button);
      });
    }
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
  });
})();
