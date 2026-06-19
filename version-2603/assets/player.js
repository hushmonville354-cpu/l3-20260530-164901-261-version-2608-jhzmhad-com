import { H as Hls } from "./hls.js";

export function initMoviePlayer(url) {
  const video = document.getElementById("movie-player");
  const button = document.getElementById("player-start");
  if (!video || !button || !url) {
    return;
  }

  let hls = null;
  const nativeType = "application/vnd.apple.mpegurl";

  if (video.canPlayType(nativeType)) {
    video.src = url;
  } else if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (!data || !data.fatal) {
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
      }
    });
  } else {
    video.src = url;
  }

  const hideButton = () => {
    button.classList.add("is-hidden");
  };

  const showButton = () => {
    button.classList.remove("is-hidden");
  };

  const startPlayback = () => {
    hideButton();
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        showButton();
      });
    }
  };

  button.addEventListener("click", startPlayback);
  video.addEventListener("click", () => {
    if (video.paused) {
      startPlayback();
    }
  });
  video.addEventListener("play", hideButton);
  video.addEventListener("ended", showButton);
  window.addEventListener("beforeunload", () => {
    if (hls) {
      hls.destroy();
    }
  });
}
