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
    profileToken: document.getElementById('profileToken'),
    profileAvatar: document.getElementById('profileAvatar'),
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    adminCode: document.getElementById('adminCode'),
    nameInput: document.getElementById('nameInput'),
    nameWarning: document.getElementById('nameWarning'),
    saveNameBtn: document.getElementById('saveNameBtn'),
    avatarInput: document.getElementById('avatarInput'),
    giftCodeInput: document.getElementById('giftCodeInput'),
    giftCodeBtn: document.getElementById('giftCodeBtn'),
    giftStatus: document.getElementById('giftStatus'),
    vkLogin: document.getElementById('vkLogin'),
    gmailLogin: document.getElementById('gmailLogin'),
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
    chartModal: document.getElementById('chartModal'),
    chartList: document.getElementById('chartList'),
    trackModal: document.getElementById('trackModal'),
    trackModalBody: document.getElementById('trackModalBody'),
    loginModalBtn: document.getElementById('loginModalBtn'),
    settingsModalBtn: document.getElementById('settingsModalBtn'),
    chartOpenBtn: document.getElementById('chartOpenBtn'),
    releaseBadge: document.getElementById('releaseBadge'),
    volume: document.getElementById('volume'),
    repeatBtn: document.getElementById('repeatBtn'),
    muteBtn: document.getElementById('muteBtn'),
    platformLinks: document.getElementById('platformLinks'),
    chatTitle: document.getElementById('chatTitle'),
    clock: document.getElementById('clock'),
    headerClock: document.getElementById('headerClock'),
    newsTicker: document.getElementById('newsTicker'),
    newsTickerBtn: document.getElementById('newsTickerBtn'),
    newsModalBtn: document.getElementById('newsModalBtn'),
    newsModal: document.getElementById('newsModal'),
    newsList: document.getElementById('newsList'),
    themeToggle: document.getElementById('themeToggle'),
  };

  const ADMIN_SECRET = '4096-AVZALOV';
  const STORAGE_KEY = 'avzal_users';
  const CURRENT_KEY = 'avzal_current_user';
  const state = {
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    isMuted: false,
    isRepeat: false,
    roles: ['Слушатель'],
    user: { name: 'Гость', level: 1, ruz: 0, id: '—', token: '—', nameLocked: false, avatar: '' },
    purchased: new Set(),
    users: [],
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

  const generateId = () => `ID-${Math.random().toString(16).slice(2, 7).toUpperCase()}-${Date.now().toString(16).slice(-3)}`;
  const generateToken = () => {
    const cryptoObj = typeof crypto !== 'undefined' ? crypto : null;
    const uuid = cryptoObj?.randomUUID ? cryptoObj.randomUUID() : null;
    return `tok-${uuid || Math.random().toString(36).slice(2, 10)}`;
  };

  const persistUsers = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users: state.users }));
    localStorage.setItem(CURRENT_KEY, state.user.id);
  };

  const loadUsers = async () => {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      state.users = parsed.users || [];
      return state.users;
    }
    try {
      const res = await fetch('data/users.json');
      const json = await res.json();
      state.users = json.users || [];
      persistUsers();
      return state.users;
    } catch (e) {
      state.users = [];
      return state.users;
    }
  };

  const setCurrentUser = (user) => {
    state.user = user;
    persistUsers();
  };

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
    elements.profileToken.textContent = `Токен: ${state.user.token || '—'}`;
    if (elements.profileAvatar) {
      elements.profileAvatar.style.backgroundImage = state.user.avatar
        ? `url(${state.user.avatar})`
        : 'linear-gradient(135deg, var(--accent-2), var(--accent-1))';
      elements.profileAvatar.textContent = state.user.avatar ? '' : state.user.name.slice(0, 2).toUpperCase();
    }
    if (elements.nameInput) {
      elements.nameInput.value = state.user.name || '';
      elements.nameInput.disabled = Boolean(state.user.nameLocked);
      elements.saveNameBtn.disabled = Boolean(state.user.nameLocked);
      elements.nameWarning.textContent = state.user.nameLocked
        ? 'Имя уже закреплено. Повторное изменение недоступно.'
        : 'Имя можно изменить только один раз. После сохранения поле заблокируется.';
    }
    renderRoles();
  };

  const bootstrapUser = async () => {
    await loadUsers();
    const currentId = localStorage.getItem(CURRENT_KEY);
    let current = state.users.find((u) => u.id === currentId);
    if (!current) {
      current = {
        id: generateId(),
        token: generateToken(),
        name: 'Гость',
        level: 1,
        ruz: 5,
        avatar: '',
        nameLocked: false,
        role: 'Слушатель',
      };
      state.users.push(current);
      persistUsers();
    }
    state.user = current;
    state.roles = [current.role || 'Слушатель'];
  };

  const saveUsersToState = (user) => {
    const existingIndex = state.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) state.users[existingIndex] = user;
    else state.users.push(user);
    setCurrentUser(user);
  };

  const handleNameSave = () => {
    const value = (elements.nameInput.value || '').trim();
    if (!value) return;
    if (state.user.nameLocked) {
      elements.nameWarning.textContent = 'Имя уже закреплено. Изменить нельзя.';
      return;
    }
    state.user.name = value;
    state.user.nameLocked = true;
    saveUsersToState(state.user);
    renderProfile();
  };

  const handleAvatarUpload = (evt) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.user.avatar = reader.result;
      saveUsersToState(state.user);
      renderProfile();
    };
    reader.readAsDataURL(file);
  };

  const giftCodes = {
    AVZALLOVE: { ruz: 50, message: 'Добавлено 50 RUZCOIN за поддержку артиста.' },
    EARLYDROP: { ruz: 10, message: '10 RUZCOIN за ранние релизы.' },
    BACKTOSTAGE: { ruz: 30, message: 'Возврат на сцену · бонус 30 RUZCOIN.' },
  };

  const handleGiftCode = () => {
    const code = (elements.giftCodeInput.value || '').trim().toUpperCase();
    if (!code) return;
    const gift = giftCodes[code];
    if (!gift) {
      elements.giftStatus.textContent = 'Код не найден. Попробуйте другой.';
      return;
    }
    state.user.ruz += gift.ruz;
    elements.giftStatus.textContent = `${gift.message} Новый баланс: ${state.user.ruz}`;
    elements.giftCodeInput.value = '';
    saveUsersToState(state.user);
    renderProfile();
  };

  const applySocialProfile = (provider) => {
    const presets = {
      vk: { name: 'VK · AVZALØV', avatar: 'img/background.jpg' },
      gmail: { name: 'Gmail · AVZALØV', avatar: 'img/background.jpg' },
    };
    const preset = presets[provider];
    if (!preset) return;
    state.user.name = preset.name;
    state.user.avatar = preset.avatar;
    state.user.nameLocked = true;
    saveUsersToState(state.user);
    renderProfile();
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
    filtered.forEach((track) => {
      const card = createTrackCard(track);
      const detailsBtn = card.querySelector('.btn.ghost');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => openTrackModal(track));
      }
      elements.tracksList.appendChild(card);
    });
  };

  const openTrackModal = (track) => {
    if (!elements.trackModalBody) return;
    const release = formatReleaseDate(track);
    const access = track.access ? `Доступ: ${track.access}` : 'Открытый';
    elements.trackModalBody.innerHTML = `
      <div class="track-modal__header">
        <img src="${getCoverPath(track)}" alt="Обложка ${track.title}" onerror="this.src='img/background.jpg'" />
        <div>
          <p class="label">${track.type || 'Single'}</p>
          <h3 id="trackModalTitle">${track.title}</h3>
          <p class="muted">${release} · ${access}</p>
          <div class="chip">${languagesLabel(track.languages)}</div>
        </div>
      </div>
      <div class="track-modal__meta">
        <div class="pill">Прослушивания: ${track.plays?.toLocaleString('ru-RU') || '—'}</div>
        <div class="pill">${track.hasClip ? 'Есть клип' : 'Аудио'}</div>
        <div class="pill">${track.copyright || '© AVZALØV'}</div>
      </div>
      <div class="track-modal__actions">
        <button class="btn primary" ${getAudioPath(track) ? '' : 'disabled'} data-play="${track.slug}">Слушать</button>
        ${track.clipUrl ? `<a class="btn ghost" href="${track.clipUrl}" target="_blank" rel="noreferrer">Клип</a>` : ''}
      </div>
    `;
    const playBtn = elements.trackModalBody.querySelector('[data-play]');
    if (playBtn) playBtn.addEventListener('click', () => selectTrackBySlug(track.slug));
    openModal(elements.trackModal);
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

  const renderChartModal = () => {
    if (!elements.chartList) return;
    const top = [...state.playlist]
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, 10)
      .map((track, index) => {
        const delta = Math.round((Math.random() - 0.5) * 20);
        const sign = delta >= 0 ? '+' : '–';
        return { ...track, position: index + 1, delta, sign };
      });
    elements.chartList.innerHTML = '';
    top.forEach((track) => {
      const row = document.createElement('div');
      row.className = 'chart-row';
      row.innerHTML = `
        <div class="chart-row__left">
          <span class="chart-pos">${track.position}</span>
          <img src="${track.coverPath || getCoverPath(track)}" alt="${track.title}" onerror="this.src='img/background.jpg'" />
          <div>
            <strong>${track.title}</strong>
            <p class="muted tiny">${formatReleaseDate(track)}</p>
          </div>
        </div>
        <div class="chart-row__meta">
          <span class="pill">${track.plays?.toLocaleString('ru-RU') || '—'} прослушиваний</span>
          <span class="pill ${track.delta >= 0 ? 'pill--up' : 'pill--down'}">${sign}${Math.abs(track.delta)}%</span>
        </div>
      `;
      elements.chartList.appendChild(row);
    });
    openModal(elements.chartModal);
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
    if (elements.headerClock) {
      elements.headerClock.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
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
    { user: 'AVZALØV', role: 'артист', text: 'Плеер стал компактнее и перетаскивается за угол ⇲.' },
    { user: 'Команда', role: 'модератор', text: 'Ранние треки стоят 1 RUZCOIN до даты релиза, дальше бесплатно.' },
    { user: 'Слушатель', role: 'fan', text: 'Дата релиза «Перегрев» — 27.11.2025 12:00, уже в расписании.' },
    { user: 'Комьюнити', role: 'staff', text: 'Новые площадки: Яндекс, VK Музыка, Apple Music добавлены в плеер.' },
    { user: 'Слушатель', role: 'fan', text: 'За 1 RUZCOIN можно крутить ранний доступ неограниченно до премьеры.' },
    { user: 'AVZALØV', role: 'артист', text: 'Не вышедшие треки продаются по 1 монете, баланс видно в профиле.' },
    { user: 'Команда', role: 'модератор', text: 'Даты релизов синхронизированы с календарём — сайт сам понимает статус.' },
    { user: 'Слушатель', role: 'fan', text: 'Игровая панель теперь открывает список площадок через кнопку.' },
    { user: 'Команда', role: 'модератор', text: 'Пишите вопросы по релизам в чат или через контакты Telegram и WhatsApp.' },
  ];

  const newsItems = [
    'AVZALØV: вся библиотека треков с обложками и ранним доступом снова на месте.',
    'Аудиоплеер, чат и роли подключены в едином интерфейсе — можно слушать и общаться.',
    'AVZALØV NEWS: готовятся живые выступления, следи за датами релизов.',
    'Обновление профиля: аватар кругом, уникальный ID и токен сохраняются на устройстве.',
    'Промокоды добавляют RUZCOIN и доступ к ранним релизам, проверь свои бонусы.',
  ];
  let newsPointer = 0;

  const renderNewsTicker = () => {
    if (!elements.newsTicker) return;
    elements.newsTicker.textContent = newsItems[newsPointer % newsItems.length];
    newsPointer += 1;
  };

  const renderNewsModal = () => {
    if (!elements.newsList) return;
    elements.newsList.innerHTML = '';
    newsItems.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'news-item';
      row.innerHTML = `<span class="pill">${index + 1}</span><p>${item}</p>`;
      elements.newsList.appendChild(row);
    });
    openModal(elements.newsModal);
  };

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
      state.user = {
        ...state.user,
        name: 'Рузиль AVZALØV',
        level: 12,
        ruz: 128,
        id: state.user.id || 'ADMIN-4096',
        token: state.user.token || generateToken(),
        role: 'Админ',
        nameLocked: true,
      };
      state.roles = ['Админ'];
    } else {
      state.user = {
        ...state.user,
        name: 'Слушатель',
        level: 2,
        ruz: 24,
        token: state.user.token || generateToken(),
        role: 'Слушатель',
        nameLocked: true,
      };
      state.roles = ['Слушатель'];
    }
    state.purchased.clear();
    saveUsersToState(state.user);
    renderProfile();
    renderChat();
    closeModal(elements.loginModal);
  };

  const handleLogout = () => {
    state.user = { ...state.user, name: 'Гость', level: 1, ruz: 0, role: 'Слушатель', nameLocked: false };
    state.roles = ['Слушатель'];
    elements.adminCode.value = '';
    saveUsersToState(state.user);
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
    elements.saveNameBtn?.addEventListener('click', handleNameSave);
    elements.avatarInput?.addEventListener('change', handleAvatarUpload);
    elements.giftCodeBtn?.addEventListener('click', handleGiftCode);
    elements.vkLogin?.addEventListener('click', () => applySocialProfile('vk'));
    elements.gmailLogin?.addEventListener('click', () => applySocialProfile('gmail'));
    elements.accessFilter.addEventListener('change', renderTracks);
    elements.languageFilter.addEventListener('change', renderTracks);
    elements.ctaPlay.addEventListener('click', () => selectTrackBySlug(state.playlist[0]?.slug));
    elements.ctaChat.addEventListener('click', () => openModal(elements.chatModal));
    elements.ctaGame.addEventListener('click', () => document.getElementById('game').scrollIntoView({ behavior: 'smooth' }));
    elements.openProfile.addEventListener('click', () => document.getElementById('profile').scrollIntoView({ behavior: 'smooth' }));
    elements.chartOpenBtn?.addEventListener('click', renderChartModal);
    elements.newsModalBtn?.addEventListener('click', renderNewsModal);
    elements.newsTickerBtn?.addEventListener('click', renderNewsModal);
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
    [elements.chatModal, elements.loginModal, elements.settingsModal, elements.chartModal, elements.trackModal, elements.newsModal].forEach((modal) => {
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
        [
          elements.chatModal,
          elements.loginModal,
          elements.settingsModal,
          elements.chartModal,
          elements.trackModal,
          elements.newsModal,
        ].forEach((modal) => closeModal(modal));
      }
    });
  };

  const init = async () => {
    await bootstrapUser();
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
    renderNewsTicker();
    setInterval(updateClock, 1000);
    setInterval(renderNewsTicker, 5000);
  };

  init();
})();
