(function () {
  const tracksData = window.RELEASED_TRACKS_DATA || [];

  const elements = {
    tracksList: document.getElementById('tracksList'),
    playlist: document.getElementById('playlist'),
    playerCover: document.getElementById('playerCover'),
    playerTitle: document.getElementById('playerTitle'),
    playerInfo: document.getElementById('playerInfo'),
    playerStatus: document.getElementById('playerStatus'),
    currentTime: document.getElementById('currentTime'),
    duration: document.getElementById('duration'),
    progress: document.getElementById('progress'),
    playBtn: document.getElementById('playBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    audio: document.getElementById('audio'),
    chatFeed: document.getElementById('chatFeed'),
    chatForm: document.getElementById('chatForm'),
    chatInput: document.getElementById('chatInput'),
    roleBadges: document.getElementById('roleBadges'),
    roleChip: document.getElementById('roleChip'),
    profileName: document.getElementById('profileName'),
    profileMeta: document.getElementById('profileMeta'),
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    adminCode: document.getElementById('adminCode'),
    accessFilter: document.getElementById('accessFilter'),
    languageFilter: document.getElementById('languageFilter'),
    tracksCount: document.getElementById('tracksCount'),
    playableCount: document.getElementById('playableCount'),
    earlyCount: document.getElementById('earlyCount'),
    nextRelease: document.getElementById('nextRelease'),
    openProfile: document.getElementById('openProfile'),
    ctaPlay: document.getElementById('ctaPlay'),
    ctaChat: document.getElementById('ctaChat'),
    ctaGame: document.getElementById('ctaGame'),
    playerDock: document.getElementById('playerDock'),
    dockToggle: document.getElementById('dockToggle'),
    gameToggle: document.getElementById('gameToggle'),
    notifyToggle: document.getElementById('notifyToggle'),
  };

  const ADMIN_SECRET = '4096-AVZALOV';
  const state = {
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    roles: ['Слушатель'],
    user: { name: 'Гость', level: 1, ruz: 0 },
  };

  const overrides = {
    'davyl': 'Davyl.mp3',
    'teapot': 'Teapot.mp3',
    'the-psychopath': 'The Psychopath.mp3',
  };
  const coverOverrides = {
    'davyl': 'Davyl.jpg',
    'teapot': 'Teapot.jpg',
  };

  const coverExt = (track) => track.coverExt || '.jpg';
  const audioExt = (track) => track.audioExt || '.mp3';

  const getCoverPath = (track) => coverOverrides[track.slug] ? `img/${coverOverrides[track.slug]}` : `img/${track.slug}${coverExt(track)}`;
  const getAudioPath = (track) => {
    if (track.audio === false) return null;
    if (overrides[track.slug]) return `audio/${overrides[track.slug]}`;
    return `audio/${track.slug}${audioExt(track)}`;
  };

  const formatReleaseDate = (date) => date || 'Скоро';
  const languagesLabel = (langs) => (langs ? langs.join(' / ') : 'multi');

  const renderStats = () => {
    elements.tracksCount.textContent = tracksData.length;
    const playable = tracksData.filter((t) => Boolean(getAudioPath(t)));
    elements.playableCount.textContent = playable.length;
    const early = tracksData.filter((t) => (t.access || '').includes('early')).length;
    elements.earlyCount.textContent = early;
    const next = tracksData.find((t) => (t.releaseDate || '').toLowerCase() !== 'скоро');
    elements.nextRelease.textContent = next ? next.releaseDate : 'Скоро';
  };

  const renderRoles = () => {
    elements.roleBadges.innerHTML = '';
    state.roles.forEach((role) => {
      const span = document.createElement('span');
      span.className = 'badge';
      span.textContent = role;
      elements.roleBadges.appendChild(span);
    });
    elements.roleChip.textContent = `${state.user.name} · ${state.roles.join(', ')}`;
  };

  const renderProfile = () => {
    elements.profileName.textContent = state.user.name;
    elements.profileMeta.textContent = `ID: ${state.user.id || '—'} · уровень ${state.user.level} · RUZCOIN: ${state.user.ruz}`;
    renderRoles();
  };

  const createTrackCard = (track) => {
    const audioPath = getAudioPath(track);
    const card = document.createElement('article');
    card.className = 'track-card';

    const cover = document.createElement('img');
    cover.src = getCoverPath(track);
    cover.alt = `Обложка ${track.title}`;
    cover.onerror = () => (cover.src = 'img/background.jpg');

    const body = document.createElement('div');
    body.className = 'track-card__body';

    const top = document.createElement('div');
    top.className = 'track-card__top';
    const title = document.createElement('h3');
    title.className = 'track-card__title';
    title.textContent = track.title;
    const price = document.createElement('span');
    price.className = 'chip';
    price.textContent = track.price === 0 ? 'Free' : `${track.price} RUZ`;
    top.append(title, price);

    const meta = document.createElement('div');
    meta.className = 'track-card__meta';
    const release = document.createElement('span');
    release.className = 'chip chip--soon';
    release.textContent = formatReleaseDate(track.releaseDate);
    const access = document.createElement('span');
    access.className = 'chip';
    access.textContent = track.access ? `Доступ: ${track.access}` : 'Open';
    const langs = document.createElement('span');
    langs.className = 'chip';
    langs.textContent = `Языки: ${languagesLabel(track.languages)}`;
    meta.append(release, access, langs);

    const footer = document.createElement('div');
    footer.className = 'track-card__footer';
    const plays = document.createElement('span');
    plays.textContent = `Прослушивания: ${track.plays?.toLocaleString('ru-RU') || '—'}`;
    const copyright = document.createElement('span');
    copyright.textContent = track.copyright || '© AVZALØV';
    footer.append(plays, copyright);

    const actions = document.createElement('div');
    actions.className = 'hero__actions';
    const listen = document.createElement('button');
    listen.className = 'btn primary tiny';
    listen.textContent = 'Слушать';
    listen.disabled = !audioPath;
    listen.addEventListener('click', () => selectTrackBySlug(track.slug));
    const details = document.createElement('button');
    details.className = 'btn ghost tiny';
    details.textContent = track.hasClip ? 'Клип' : 'Подробнее';
    actions.append(listen, details);

    body.append(top, meta, actions, footer);
    card.append(cover, body);
    return card;
  };

  const renderTracks = () => {
    const access = elements.accessFilter.value;
    const language = elements.languageFilter.value;
    elements.tracksList.innerHTML = '';
    const filtered = tracksData.filter((track) => {
      const accessOk = access === 'all' || (track.access || 'open') === access;
      const langs = track.languages || [];
      const langOk = language === 'all' || langs.includes(language);
      return accessOk && langOk;
    });
    filtered.forEach((track) => elements.tracksList.appendChild(createTrackCard(track)));
  };

  const buildPlaylist = () => {
    state.playlist = tracksData
      .map((track) => ({ ...track, audioPath: getAudioPath(track), coverPath: getCoverPath(track) }))
      .filter((item) => Boolean(item.audioPath));
    renderPlaylist();
  };

  const renderPlaylist = () => {
    elements.playlist.innerHTML = '';
    state.playlist.forEach((track, index) => {
      const button = document.createElement('button');
      button.textContent = track.title;
      if (state.currentIndex === index) button.classList.add('active');
      button.addEventListener('click', () => setCurrentTrack(index, true));
      elements.playlist.appendChild(button);
    });
  };

  const formatTime = (time) => {
    if (Number.isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const setCurrentTrack = (index, autoplay = false) => {
    const track = state.playlist[index];
    if (!track) return;
    state.currentIndex = index;
    elements.audio.src = track.audioPath;
    elements.playerCover.src = track.coverPath;
    elements.playerTitle.textContent = track.title;
    elements.playerInfo.textContent = `${formatReleaseDate(track.releaseDate)} · ${languagesLabel(track.languages)} · ${
      track.copyright || '© AVZALØV'
    }`;
    elements.playerStatus.textContent = track.access ? `Доступ: ${track.access}` : 'Открытый трек';
    renderPlaylist();
    if (autoplay) {
      playTrack();
    }
  };

  const playTrack = () => {
    elements.audio.play();
    state.isPlaying = true;
    elements.playBtn.textContent = '⏸️';
    elements.playerStatus.textContent = 'Сейчас играет';
  };

  const pauseTrack = () => {
    elements.audio.pause();
    state.isPlaying = false;
    elements.playBtn.textContent = '▶️';
    elements.playerStatus.textContent = 'Плеер на паузе';
  };

  const togglePlay = () => {
    if (!elements.audio.src) {
      setCurrentTrack(0, true);
      return;
    }
    state.isPlaying ? pauseTrack() : playTrack();
  };

  const nextTrack = () => setCurrentTrack((state.currentIndex + 1) % state.playlist.length, true);
  const prevTrack = () => setCurrentTrack((state.currentIndex - 1 + state.playlist.length) % state.playlist.length, true);

  const updateProgress = () => {
    elements.currentTime.textContent = formatTime(elements.audio.currentTime);
    elements.duration.textContent = formatTime(elements.audio.duration);
    const percent = (elements.audio.currentTime / elements.audio.duration) * 100;
    elements.progress.value = Number.isFinite(percent) ? percent : 0;
  };

  const seek = () => {
    const target = (elements.progress.value / 100) * elements.audio.duration;
    elements.audio.currentTime = target;
  };

  const selectTrackBySlug = (slug) => {
    const index = state.playlist.findIndex((item) => item.slug === slug);
    if (index >= 0) setCurrentTrack(index, true);
  };

  const chatMessages = [
    { user: 'AI-бот', role: 'модератор', text: 'Плеер снова активен. Можно слушать любые треки из базы.' },
    { user: 'Рузиль', role: 'админ', text: 'Даты релизов и обложки подтягиваются из tracks-data.js, как и раньше.' },
    { user: 'Слушатель', role: 'fan', text: 'Класс, роли и игра вернулись в шапку. Спасибо!' },
  ];

  const renderChat = () => {
    elements.chatFeed.innerHTML = '';
    chatMessages.forEach((msg) => {
      const item = document.createElement('div');
      item.className = 'chat-message';
      item.innerHTML = `<strong>${msg.user} · ${msg.role}</strong><p class="muted">${msg.text}</p>`;
      elements.chatFeed.appendChild(item);
    });
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const text = elements.chatInput.value.trim();
    if (!text) return;
    chatMessages.push({ user: state.user.name, role: state.roles.join(', '), text });
    elements.chatInput.value = '';
    renderChat();
    elements.chatFeed.scrollTop = elements.chatFeed.scrollHeight;
  };

  const handleLogin = () => {
    const code = elements.adminCode.value.trim();
    if (code === ADMIN_SECRET) {
      state.user = { name: 'Рузиль', level: 12, ruz: 128, id: 4096 };
      if (!state.roles.includes('Админ')) state.roles.push('Админ');
    } else {
      state.user = { name: 'Слушатель', level: 2, ruz: 24, id: 512 };
      state.roles = ['Слушатель'];
    }
    renderProfile();
  };

  const handleLogout = () => {
    state.user = { name: 'Гость', level: 1, ruz: 0 };
    state.roles = ['Слушатель'];
    elements.adminCode.value = '';
    renderProfile();
  };

  const bindEvents = () => {
    elements.playBtn.addEventListener('click', togglePlay);
    elements.nextBtn.addEventListener('click', nextTrack);
    elements.prevBtn.addEventListener('click', prevTrack);
    elements.audio.addEventListener('timeupdate', updateProgress);
    elements.audio.addEventListener('ended', nextTrack);
    elements.progress.addEventListener('input', seek);
    elements.chatForm.addEventListener('submit', handleChatSubmit);
    elements.loginBtn.addEventListener('click', handleLogin);
    elements.logoutBtn.addEventListener('click', handleLogout);
    elements.accessFilter.addEventListener('change', renderTracks);
    elements.languageFilter.addEventListener('change', renderTracks);
    elements.ctaPlay.addEventListener('click', () => selectTrackBySlug(state.playlist[0]?.slug));
    elements.ctaChat.addEventListener('click', () => document.getElementById('chat').scrollIntoView({ behavior: 'smooth' }));
    elements.ctaGame.addEventListener('click', () => document.getElementById('game').scrollIntoView({ behavior: 'smooth' }));
    elements.openProfile.addEventListener('click', () => document.getElementById('profile').scrollIntoView({ behavior: 'smooth' }));
    elements.dockToggle.addEventListener('change', () => {
      elements.playerDock.style.display = elements.dockToggle.checked ? 'grid' : 'none';
    });
    document.addEventListener('keydown', (evt) => {
      if (evt.code === 'Space' && evt.target === document.body) {
        evt.preventDefault();
        togglePlay();
      }
    });
  };

  renderStats();
  renderTracks();
  buildPlaylist();
  renderProfile();
  renderChat();
  bindEvents();
  setCurrentTrack(0);
})();
