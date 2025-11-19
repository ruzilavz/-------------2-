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
    playerHandle: document.getElementById('playerHandle'),
    dockToggle: document.getElementById('dockToggle'),
    gameToggle: document.getElementById('gameToggle'),
    notifyToggle: document.getElementById('notifyToggle'),
    gamePlatforms: document.getElementById('gamePlatforms'),
    chatLauncher: document.getElementById('chatLauncher'),
    chatModal: document.getElementById('chatModal'),
    loginModal: document.getElementById('loginModal'),
    settingsModal: document.getElementById('settingsModal'),
    loginModalBtn: document.getElementById('loginModalBtn'),
    settingsModalBtn: document.getElementById('settingsModalBtn'),
    releaseBadge: document.getElementById('releaseBadge'),
    volume: document.getElementById('volume'),
    repeatBtn: document.getElementById('repeatBtn'),
    muteBtn: document.getElementById('muteBtn'),
    platformLinks: document.getElementById('platformLinks'),
    chatTitle: document.getElementById('chatTitle'),
    clock: document.getElementById('clock'),
    themeToggle: document.getElementById('themeToggle'),
  };

  const ADMIN_SECRET = '4096-AVZALOV';
  const state = {
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    isMuted: false,
    isRepeat: false,
    roles: ['Слушатель'],
    user: { name: 'Гость', level: 1, ruz: 0 },
    purchased: new Set(),
  };

  document.body.dataset.theme = 'dark';

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

  const parseReleaseDateString = (track) => {
    const value = track.releaseDate;
    if (!value) return null;
    const normalized = value.toString().trim().toLowerCase();
    if (normalized.includes('скоро')) return null;
    const parts = normalized.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts.map((p) => Number(p));
      if (day && month && year) return new Date(year, month - 1, day);
    }
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : new Date(parsed);
  };

  const getReleaseDate = (track) => {
    const base = parseReleaseDateString(track);
    if (!base) return null;
    const [hours, minutes] = (track.releaseTime || '12:00').split(':').map((p) => Number(p));
    const release = new Date(base.getTime());
    release.setHours(hours || 0, minutes || 0, 0, 0);
    return release;
  };

  const isReleased = (track) => {
    const releaseDate = getReleaseDate(track);
    if (!releaseDate) return false;
    return Date.now() >= releaseDate.getTime();
  };

  const formatReleaseDate = (track) => {
    const releaseDate = getReleaseDate(track);
    if (!releaseDate) return 'Скоро релиз';
    return releaseDate.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const languagesLabel = (langs) => (langs ? langs.join(' / ') : 'multi');

  const renderStats = () => {
    elements.tracksCount.textContent = tracksData.length;
    const playable = tracksData.filter((t) => Boolean(getAudioPath(t)));
    elements.playableCount.textContent = playable.length;
    const early = tracksData.filter((t) => (t.access || '').includes('early') && !isReleased(t)).length;
    elements.earlyCount.textContent = early;
    const withDates = tracksData
      .map((track) => ({ track, date: getReleaseDate(track) }))
      .filter((item) => item.date)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    const next = withDates.find((item) => item.date.getTime() >= Date.now()) || withDates[0];
    elements.nextRelease.textContent = next
      ? `${next.track.title} · ${next.date.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
      : 'Скоро';
  };

  const renderRoles = () => {
    if (elements.roleBadges) {
      elements.roleBadges.innerHTML = '';
      state.roles.forEach((role) => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.textContent = role;
        elements.roleBadges.appendChild(span);
      });
    }
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
    const effectivePrice = isReleased(track) ? track.price ?? 0 : 1;
    price.textContent = effectivePrice === 0 ? 'Бесплатно' : `${effectivePrice} RUZCOIN`;
    top.append(title, price);

    const meta = document.createElement('div');
    meta.className = 'track-card__meta';
    const release = document.createElement('span');
    release.className = 'chip chip--soon';
    release.textContent = formatReleaseDate(track);
    const access = document.createElement('span');
    access.className = 'chip';
    access.textContent = track.access ? `Доступ: ${track.access}` : 'Открытый';
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
      .map((track) => {
        const price = isReleased(track) ? track.price ?? 0 : 1;
        return { ...track, price, audioPath: getAudioPath(track), coverPath: getCoverPath(track) };
      })
      .filter((item) => Boolean(item.audioPath));
    renderPlaylist();
  };

  const renderPlaylist = () => {
    elements.playlist.innerHTML = '';
    state.playlist.forEach((track, index) => {
      const button = document.createElement('button');
      button.textContent = `${track.title} · ${formatReleaseDate(track)}`;
      if (state.currentIndex === index) button.classList.add('active');
      button.addEventListener('click', () => setCurrentTrack(index, true));
      elements.playlist.appendChild(button);
    });
  };

  function renderPlatforms(track) {
    const platforms = track.platforms || ['Yandex Music', 'VK Музыка', 'Apple Music'];
    elements.platformLinks.innerHTML = '';
    platforms.forEach((item) => {
      const badge = document.createElement('span');
      badge.className = 'chip';
      badge.textContent = item;
      elements.platformLinks.appendChild(badge);
    });
  }

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
    elements.playerInfo.textContent = `${formatReleaseDate(track)} · ${languagesLabel(track.languages)} · ${
      track.copyright || '© AVZALØV'
    }`;
    const released = isReleased(track);
    elements.playerStatus.textContent = released ? 'Трек вышел' : 'Ранний доступ: 1 RUZCOIN до релиза';
    elements.releaseBadge.textContent = released
      ? `Вышел ${formatReleaseDate(track)}`
      : `До релиза: ${formatReleaseDate(track)}`;
    renderPlatforms(track);
    renderPlaylist();
    if (autoplay) {
      playTrack();
    }
  };

  const ensureEarlyAccess = () => {
    const track = state.playlist[state.currentIndex];
    if (!track) return false;
    const released = isReleased(track);
    const price = track.price ?? 1;
    const open = (track.access || '').includes('open') || price === 0;
    if (released || open || state.purchased.has(track.slug)) return true;
    if (state.user.ruz < price) {
      alert('Нужно минимум 1 RUZCOIN для раннего прослушивания. Пополните баланс в профиле.');
      return false;
    }
    const allow = confirm(`Трек в раннем доступе. Списать ${price} RUZCOIN и открыть прослушивание до релиза?`);
    if (!allow) return false;
    state.user.ruz -= price;
    state.purchased.add(track.slug);
    renderProfile();
    return true;
  };

  const playTrack = () => {
    if (!ensureEarlyAccess()) return;
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

  const updateClock = () => {
    const now = new Date();
    if (elements.clock) {
      elements.clock.textContent = now.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const toggleRepeat = () => {
    state.isRepeat = !state.isRepeat;
    elements.audio.loop = state.isRepeat;
    elements.repeatBtn.classList.toggle('active', state.isRepeat);
  };

  const toggleMute = () => {
    state.isMuted = !state.isMuted;
    elements.audio.muted = state.isMuted;
    elements.muteBtn.textContent = state.isMuted ? '🔈' : '🔇';
  };

  const changeVolume = () => {
    const volume = Number(elements.volume.value);
    elements.audio.volume = volume;
    state.isMuted = volume === 0;
    elements.muteBtn.textContent = state.isMuted ? '🔈' : '🔇';
  };

  const enableDrag = () => {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const onMove = (evt) => {
      if (!dragging) return;
      const deltaX = evt.clientX - startX;
      const deltaY = evt.clientY - startY;
      const newLeft = Math.min(Math.max(startLeft + deltaX, 8), window.innerWidth - elements.playerDock.offsetWidth - 8);
      const newTop = Math.min(Math.max(startTop + deltaY, 8), window.innerHeight - elements.playerDock.offsetHeight - 8);
      elements.playerDock.style.left = `${newLeft}px`;
      elements.playerDock.style.top = `${newTop}px`;
      elements.playerDock.style.right = 'auto';
      elements.playerDock.style.bottom = 'auto';
    };

    const stop = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', stop);
    };

    elements.playerHandle.addEventListener('mousedown', (evt) => {
      dragging = true;
      startX = evt.clientX;
      startY = evt.clientY;
      startLeft = elements.playerDock.offsetLeft;
      startTop = elements.playerDock.offsetTop;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', stop);
    });
  };

  const selectTrackBySlug = (slug) => {
    const index = state.playlist.findIndex((item) => item.slug === slug);
    if (index >= 0) setCurrentTrack(index, true);
  };

  const chatMessages = [
    { user: 'AI-бот', role: 'модератор', text: 'Плеер стал компактнее и перетаскивается за угол ⇲.' },
    { user: 'Рузиль', role: 'админ', text: 'Ранние треки стоят 1 RUZCOIN до даты релиза, дальше бесплатно.' },
    { user: 'AI-бот', role: 'модератор', text: 'Чат показывает последние 10 сообщений и подсвечивает автора.' },
    { user: 'Слушатель', role: 'fan', text: 'Дата релиза «Перегрев» — 27.11.2025 12:00, уже в расписании.' },
    { user: 'Модератор', role: 'staff', text: 'Новые площадки: Яндекс, VK Музыка, Apple Music добавлены в плеер.' },
    { user: 'Слушатель', role: 'fan', text: 'За 1 RUZCOIN можно крутить ранний доступ неограниченно до премьеры.' },
    { user: 'Рузиль', role: 'админ', text: 'Не вышедшие треки продаются по 1 монете, баланс видно в профиле.' },
    { user: 'AI-бот', role: 'модератор', text: 'Даты релизов синхронизированы с календарём — сайт сам понимает статус.' },
    { user: 'Слушатель', role: 'fan', text: 'Игровая панель теперь открывает список площадок через кнопку.' },
    { user: 'AI-бот', role: 'модератор', text: 'Пишите вопросы по релизам в чат или через контакты Telegram и WhatsApp.' },
  ];

  const renderChat = () => {
    elements.chatFeed.innerHTML = '';
    const lastMessages = chatMessages.slice(-10);
    lastMessages.forEach((msg) => {
      const item = document.createElement('div');
      const isMe = msg.user === state.user.name;
      item.className = `chat-message${isMe ? ' chat-message--me' : ''}`;
      item.innerHTML = `<strong>${msg.user} · <span class="chat-badge">${msg.role}</span></strong><p class="muted">${msg.text}</p>`;
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
    state.purchased.clear();
    renderProfile();
    renderChat();
    closeModal(elements.loginModal);
  };

  const handleLogout = () => {
    state.user = { name: 'Гость', level: 1, ruz: 0 };
    state.roles = ['Слушатель'];
    elements.adminCode.value = '';
    renderProfile();
    renderChat();
    closeModal(elements.loginModal);
  };

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const bindEvents = () => {
    elements.playBtn.addEventListener('click', togglePlay);
    elements.nextBtn.addEventListener('click', nextTrack);
    elements.prevBtn.addEventListener('click', prevTrack);
    elements.audio.addEventListener('timeupdate', updateProgress);
    elements.audio.addEventListener('loadedmetadata', updateProgress);
    elements.audio.addEventListener('ended', () => {
      if (state.isRepeat) {
        elements.audio.currentTime = 0;
        playTrack();
      } else {
        nextTrack();
      }
    });
    elements.progress.addEventListener('input', seek);
    elements.chatForm.addEventListener('submit', handleChatSubmit);
    elements.loginBtn.addEventListener('click', handleLogin);
    elements.logoutBtn.addEventListener('click', handleLogout);
    elements.accessFilter.addEventListener('change', renderTracks);
    elements.languageFilter.addEventListener('change', renderTracks);
    elements.ctaPlay.addEventListener('click', () => selectTrackBySlug(state.playlist[0]?.slug));
    elements.ctaChat.addEventListener('click', () => openModal(elements.chatModal));
    elements.ctaGame.addEventListener('click', () => document.getElementById('game').scrollIntoView({ behavior: 'smooth' }));
    elements.openProfile.addEventListener('click', () => document.getElementById('profile').scrollIntoView({ behavior: 'smooth' }));
    elements.dockToggle.addEventListener('change', () => {
      elements.playerDock.style.display = elements.dockToggle.checked ? 'grid' : 'none';
    });
    elements.chatLauncher.addEventListener('click', () => openModal(elements.chatModal));
    elements.loginModalBtn.addEventListener('click', () => openModal(elements.loginModal));
    elements.settingsModalBtn.addEventListener('click', () => openModal(elements.settingsModal));
    document.querySelectorAll('.modal__close').forEach((btn) => {
      btn.addEventListener('click', () => closeModal(document.getElementById(btn.dataset.close)));
    });
    elements.repeatBtn.addEventListener('click', toggleRepeat);
    elements.muteBtn.addEventListener('click', toggleMute);
    elements.volume.addEventListener('input', changeVolume);
    elements.themeToggle.addEventListener('change', () => {
      document.body.dataset.theme = elements.themeToggle.checked ? 'dark' : 'light';
    });
    elements.gamePlatforms.addEventListener('click', () => alert('Площадки: Steam mini, VK Play, itch.io — подключаются из Idle Game.'));
    [elements.chatModal, elements.loginModal, elements.settingsModal].forEach((modal) => {
      if (!modal) return;
      modal.addEventListener('click', (evt) => {
        if (evt.target === modal) closeModal(modal);
      });
    });
    document.addEventListener('keydown', (evt) => {
      if (evt.code === 'Space' && evt.target === document.body) {
        evt.preventDefault();
        togglePlay();
      }
      if (evt.code === 'Escape') {
        [elements.chatModal, elements.loginModal, elements.settingsModal].forEach((modal) => closeModal(modal));
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
  changeVolume();
  enableDrag();
  updateClock();
  setInterval(updateClock, 1000);
})();
