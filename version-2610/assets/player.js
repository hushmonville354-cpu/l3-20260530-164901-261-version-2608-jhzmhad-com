document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("movie-player");
  const overlay = document.getElementById("play-overlay");
  if (!video) return;

  let loaded = false;
  function loadAndPlay() {
    const stream = video.getAttribute("data-stream");
    if (!stream) return;
    if (!loaded) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      loaded = true;
    }
    if (overlay) overlay.classList.add("is-hidden");
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", loadAndPlay);
  }
  video.addEventListener("click", function () {
    if (!loaded || video.paused) {
      loadAndPlay();
    }
  });
  video.addEventListener("play", function () {
    if (overlay) overlay.classList.add("is-hidden");
  });
});
