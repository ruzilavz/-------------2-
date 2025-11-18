document.addEventListener("DOMContentLoaded", () => {
      const audioPlayer = document.getElementById("audio-player");
      const playPauseBtn = document.getElementById("play-pause-btn");
      const prevBtn = document.getElementById("prev-btn");
      const nextBtn = document.getElementById("next-btn");
      const volumeBtn = document.getElementById("volume-btn");
      const volumeSlider = document.getElementById("volume-slider");
      const playerTitle = document.querySelector(".player-title");
      const playerArtist = document.querySelector(".player-artist");
      const playerCover = document.querySelector(".player-cover img");
      const trackGrid = document.getElementById("track-grid");
      const progress = document.querySelector(".player-progress");
      const timeline = document.querySelector(".player-timeline");
      const playlistBtn = document.getElementById("playlist-btn");
      const playlistOverlay = document.querySelector(".playlist-overlay");
      const playlistCloseBtn = document.querySelector(".playlist-close-btn");
      const playlistContent = document.querySelector(".playlist-content");

      let currentTrackIndex = 0;
      let isPlaying = false;

      function createTrackCard(track, index) {
        const card = document.createElement("div");
        card.className = "track-card";
        card.dataset.index = index;

        const coverExt = track.coverExt || ".jpg";
        const audioExt = track.audioExt || ".mp3";

        card.innerHTML = `
          <div class="track-cover">
            <img src="img/${track.slug}${coverExt}" alt="${track.title}" />
            <div class="track-overlay">
              <button class="play-track-btn"><i class="fas fa-play"></i></button>
            </div>
          </div>
          <div class="track-info">
            <h4 class="track-title">${track.title}</h4>
            <p class="track-artist">AVZALØV</p>
            <div class="release-date">
              <span class="release-date-text">${track.releaseDate}</span>
            </div>
          </div>
        `;

        card.querySelector(".play-track-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          loadTrack(index);
          playTrack();
        });

        return card;
      }

      function renderTracks() {
        trackGrid.innerHTML = "";
        window.RELEASED_TRACKS_DATA.forEach((track, index) => {
          const card = createTrackCard(track, index);
          trackGrid.appendChild(card);
        });
        renderPlaylist();
      }

      function renderPlaylist() {
        playlistContent.innerHTML = "";
        window.RELEASED_TRACKS_DATA.forEach((track, index) => {
          const item = document.createElement("div");
          item.className = "playlist-item";
          item.dataset.index = index;
          item.innerHTML = `<span>${track.title}</span>`;
          if (index === currentTrackIndex) {
            item.classList.add("active");
          }
          item.addEventListener("click", () => {
            loadTrack(index);
            playTrack();
            playlistOverlay.style.display = "none";
          });
          playlistContent.appendChild(item);
        });
      }

      function loadTrack(index) {
        const track = window.RELEASED_TRACKS_DATA[index];
        const audioExt = track.audioExt || ".mp3";
        playerTitle.textContent = track.title;
        playerCover.src = `img/${track.slug}${track.coverExt || ".jpg"}`;
        audioPlayer.src = `audio/${track.slug}${audioExt}`;
        currentTrackIndex = index;
        document.body.style.setProperty('--active-cover', `url('img/${track.slug}${track.coverExt || ".jpg"}')`);
        updatePlaylistActiveState();
      }

      function updatePlaylistActiveState() {
        const items = playlistContent.querySelectorAll(".playlist-item");
        items.forEach((item, index) => {
          if (index === currentTrackIndex) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      }

      function playTrack() {
        isPlaying = true;
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }

      function pauseTrack() {
        isPlaying = false;
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }

      function togglePlayPause() {
        if (isPlaying) {
          pauseTrack();
        } else {
          playTrack();
        }
      }

      function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + window.RELEASED_TRACKS_DATA.length) % window.RELEASED_TRACKS_DATA.length;
        loadTrack(currentTrackIndex);
        playTrack();
      }

      function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % window.RELEASED_TRACKS_DATA.length;
        loadTrack(currentTrackIndex);
        playTrack();
      }

      function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
      }

      function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
      }

      function toggleMute() {
        audioPlayer.muted = !audioPlayer.muted;
        volumeBtn.innerHTML = audioPlayer.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
      }

      function setVolume() {
        audioPlayer.volume = volumeSlider.value;
        audioPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }

      playPauseBtn.addEventListener("click", togglePlayPause);
      prevBtn.addEventListener("click", prevTrack);
      nextBtn.addEventListener("click", nextTrack);
      audioPlayer.addEventListener("timeupdate", updateProgress);
      timeline.addEventListener("click", setProgress);
      audioPlayer.addEventListener("ended", nextTrack);
      volumeBtn.addEventListener("click", toggleMute);
      volumeSlider.addEventListener("input", setVolume);

      playlistBtn.addEventListener("click", () => {
        playlistOverlay.style.display = "flex";
      });

      playlistCloseBtn.addEventListener("click", () => {
        playlistOverlay.style.display = "none";
      });

      // Live Time
      const timeEl = document.getElementById("time");
      function updateTime() {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString("ru-RU", {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Moscow'
        });
      }
      setInterval(updateTime, 1000);
      updateTime();

      renderTracks();
      loadTrack(0);
    });