(function () {
var Hls = window.Hls;

function setStatus(player, message) {
  var status = player.querySelector('[data-player-status]');
  if (status) {
    status.textContent = message;
  }
}

function initializePlayer(player) {
  var video = player.querySelector('video[data-src]');
  var startButton = player.querySelector('[data-player-start]');

  if (!video || !startButton) {
    return;
  }

  var source = video.getAttribute('data-src');
  var hlsInstance = null;

  function attachSource() {
    if (!source) {
      setStatus(player, '当前影片暂无可用播放源');
      return Promise.reject(new Error('Missing video source'));
    }

    if (player.classList.contains('is-ready')) {
      return video.play();
    }

    setStatus(player, '正在加载高清播放源…');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      player.classList.add('is-ready');
      setStatus(player, '播放源已就绪');
      return video.play();
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        player.classList.add('is-ready');
        setStatus(player, '播放源已就绪');
        video.play().catch(function () {
          setStatus(player, '浏览器阻止自动播放，请再次点击播放');
        });
      });
      hlsInstance.on(Hls.Events.ERROR, function (_event, data) {
        if (data && data.fatal) {
          setStatus(player, '播放源加载失败，请刷新页面后重试');
        }
      });
      return Promise.resolve();
    }

    setStatus(player, '当前浏览器不支持 HLS 播放');
    return Promise.reject(new Error('HLS is not supported'));
  }

  startButton.addEventListener('click', function () {
    attachSource().catch(function () {
      // Status is shown in the player; no extra UI required.
    });
  });

  video.addEventListener('play', function () {
    player.classList.add('is-ready');
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}

document.querySelectorAll('[data-player]').forEach(initializePlayer);
}());
