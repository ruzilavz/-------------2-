document.addEventListener('DOMContentLoaded', () => {
  (function () {
    const tracksData = window.RELEASED_TRACKS_DATA || [];

    const elements = {
      tracksList: document.getElementById('tracksList'),
      tracksGallery: document.getElementById('tracksGallery'),
      mobileRail: document.getElementById('mobileRail'),
      mobilePlayerTitle: document.getElementById('mobilePlayerTitle'),
      mobilePlayerMeta: document.getElementById('mobilePlayerMeta'),
      playlist: document.getElementById('playlist'),
      playerCover: document.getElementById('playerCover'),
      playerTitle: document.getElementById('playerTitle'),
      playerInfo: document.getElementById('playerInfo'),
      playerStatus: document.getElementById('playerStatus'),
      playerAccess: document.getElementById('playerAccess'),
      playerLanguages: document.getElementById('playerLanguages'),
      playerPlays: document.getElementById('playerPlays'),
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
      profileModal: document.getElementById('profileModal'),
      profileModalName: document.getElementById('profileTitle'),
      profileModalMeta: document.getElementById('profileModalMeta'),
      profileModalToken: document.getElementById('profileModalToken'),
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
      profileToggle: document.getElementById('profileToggle'),
      profileDropdown: document.getElementById('profileDropdown'),
      ctaPlay: document.getElementById('ctaPlay'),
      ctaChat: document.getElementById('ctaChat'),
      ctaGame: document.getElementById('ctaGame'),
      miniPlayer: document.getElementById('miniPlayer'),
      miniCover: document.getElementById('miniCover'),
      miniTitle: document.getElementById('miniTitle'),
      miniInfo: document.getElementById('miniInfo'),
      miniProgress: document.getElementById('miniProgress'),
      miniPlay: document.getElementById('miniPlay'),
      miniPrev: document.getElementById('miniPrev'),
      miniNext: document.getElementById('miniNext'),
      miniHide: document.getElementById('miniHide'),
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
      loginStatus: document.getElementById('loginStatus'),
      navToggle: document.getElementById('navToggle'),
      mainNav: document.getElementById('mainNav'),
      mobileBadge: document.getElementById('mobileBadge'),
      mobileCover: document.getElementById('mobileCover'),
      mobileTitle: document.getElementById('mobileTitle'),
      mobileMeta: document.getElementById('mobileMeta'),
      mobileEyebrow: document.getElementById('mobileEyebrow'),
      mobilePlays: document.getElementById('mobilePlays'),
      mobileDuration: document.getElementById('mobileDuration'),
      mobileAccess: document.getElementById('mobileAccess'),
      mobileExplicit: document.getElementById('mobileExplicit'),
      mobileTags: document.getElementById('mobileTags'),
      mobileRelease: document.getElementById('mobileRelease'),
      mobilePlay: document.getElementById('mobilePlay'),
      mobileLike: document.getElementById('mobileLike'),
      mobileShare: document.getElementById('mobileShare'),
    };

    const ADMIN_CODES = Array.from({ length: 50 }, (_, i) => `AVZAL-${String(i + 1).padStart(3, '0')}`);
    const STORAGE_KEY = 'avzal_users';
    const CURRENT_KEY = 'avzal_current_user';
    const state = {
      playlist: [],
      currentIndex: 0,
      isPlaying: false,
      isMuted: false,
      isRepeat: false,
      roles: ['Слушатель'],
      user: {
        name: 'Гость',
        level: 2,
        ruz: 23,
        id: 'ID-BA3B1-0d8',
        token: 'tok-89cd5f0f-f50a-42f2-bd25-27ff05d2ca65',
        nameLocked: false,
        avatar: '',
      },
      purchased: new Set(),
      liked: new Set(),
      users: [],
    };

    document.body.dataset.theme = 'dark';

    const pseudoRandom = (seed, mod = 1000) => {
      const str = String(seed);
      let hash = 0;
      for (let i = 0; i < str.length; i += 1) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash % mod);
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

    const icons = {
      eye: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5c5 0 9.27 3.11 11 7-1.73 3.89-6 7-11 7S2.73 15.89 1 12c1.73-3.89 6-7 11-7Zm0 2c-3.08 0-6.08 1.8-7.67 5C5.92 15.2 8.92 17 12 17s6.08-1.8 7.67-5C18.08 8.8 15.08 7 12 7Zm0 2.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Z"/></svg>',
      calendar: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 7H4v10h16V9Z"/></svg>',
      language: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h7v2H5v4h6v2H5v4h7v2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13.94 0l.77 1.85-4.63 11.1h-2.17l1.55-3.6L9 5h2.17l3.04 7.48L16.83 9h-3.1l.77-2H19Z"/></svg>',
      clip: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 3a5 5 0 0 1 5 5v5a6.5 6.5 0 1 1-13 0V8a3 3 0 0 1 6 0v5a1.5 1.5 0 1 1-3 0V9h2v4a.5.5 0 0 0 1 0V8a1 1 0 1 0-2 0v5a2.5 2.5 0 1 0 5 0V8a3 3 0 0 0-6 0v5a4.5 4.5 0 1 0 9 0V8a5 5 0 0 0-5-5Z"/></svg>',
      audio: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 4l6 4v8l-6 4V4Zm-7 3h2v10H4V7Zm14 0h2v10h-2V7Z"/></svg>',
      heart: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21c-5-4.55-8.33-7.72-8.33-11.39C3.67 6.2 6.1 4 8.92 4c1.5 0 2.75.72 3.58 1.82C13.33 4.72 14.58 4 16.08 4c2.83 0 5.25 2.2 5.25 5.61c0 3.67-3.33 6.84-8.33 11.39Z"/></svg>',
      comment: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7l-4 4V6a2 2 0 0 1 2-2Zm0 2v9.17L6.17 14H19V6H5Z"/></svg>',
      repeat: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 2v2H7a5 5 0 0 0-5 5v3h2V9a3 3 0 0 1 3-3h10v2l4-3l-4-3Zm0 11v2H7l-4 3l4 3v-2h10a5 5 0 0 0 5-5v-3h-2v3a3 3 0 0 1-3 3Z"/></svg>',
      headphones: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 1 9 9v7a2 2 0 0 1-2 2h-3v-8h5a7 7 0 0 0-14 0h5v8H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 9-9Z"/></svg>',
      timer: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 2h6v2H9V2Zm3 4a8 8 0 1 1-8 8a8 8 0 0 1 8-8Zm0 2a6 6 0 1 0 6 6a6 6 0 0 0-6-6Zm-1 1.5h2v4.25l2.25 2.25l-1.5 1.5L11 13.75Z"/></svg>',
      play: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.14 19 12 8 18.86V5.14Z"/></svg>',
      pause: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/></svg>',
      share: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m18 16.08l-7.05-3.49l-.9.44l-.13.06A4 4 0 1 1 9 9.91l.9.44L17 6l-7.1-3.51L8.9 3a4 4 0 1 1-.08 2.69l.08-.19l.9-.44L17 8l-7.05 3.48l-.9-.43l-.08-.04A4 4 0 1 0 8.9 15l.1-.23l.95-.44L18 13Z"/></svg>',
      info: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 9h2v8h-2V9Zm0-4h2v2h-2V5Zm1-3a10 10 0 1 1-10 10A10 10 0 0 1 12 2Zm0 2a8 8 0 1 0 8 8a8 8 0 0 0-8-8Z"/></svg>',
    };

    const icon = (name) => icons[name] || '';

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

    const deriveDurationSeconds = (track) => {
      if (typeof track.duration === 'number') return track.duration;
      return 150 + pseudoRandom(`${track.slug}-duration`, 90);
    };

    const formatDurationLabel = (seconds) => {
      const mins = Math.floor(seconds / 60) || 0;
      const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
      return `${mins}:${secs}`;
    };

    const deriveTags = (track) => {
      const tags = [];
      if (track.access?.includes('early')) tags.push('#early-access');
      if (track.languages?.includes('tt')) tags.push('#tatar');
      if (track.languages?.includes('ru')) tags.push('#russian');
      if (track.explicit) tags.push('#explicit');
      if (track.hasClip) tags.push('#clip-ready');
      if ((track.platforms || []).includes('Spotify')) tags.push('#spotify');
      return tags;
    };

    const getTrackStats = (track) => {
      const plays = track.plays || 480;
      const likes = track.likes ?? Math.max(120, Math.round(plays * 0.62));
      const comments = track.comments ?? Math.max(6, Math.round(plays * 0.08));
      const remixes = track.remixes ?? Math.max(0, Math.round((plays % 180) / 12));
      const listeners = track.listeners ?? Math.max(likes + comments, Math.round(plays * 0.48));
      const durationSeconds = deriveDurationSeconds(track);
      const tags = track.tags?.length ? track.tags : deriveTags(track);
      return { plays, likes, comments, remixes, listeners, durationSeconds, tags };
    };

    const isFreshRelease = (track) => {
      const releaseDate = getReleaseDate(track);
      if (!releaseDate) return false;
      const diff = Math.abs(Date.now() - releaseDate.getTime());
      const days = diff / (1000 * 60 * 60 * 24);
      return days <= 10;
    };

    const getTrackBadges = (track, stats, released) => {
      const badges = [];
      if (!released) badges.push('Ранний доступ');
      if (released && isFreshRelease(track)) badges.push('Новый релиз');
      if (stats.plays > 900 || stats.likes > 800) badges.push('Топ чарт');
      if (track.hasClip) badges.push('Клип доступен');
      if (track.explicit) badges.push('Explicit');
      if ((track.platforms || []).includes('Apple Music')) badges.push('Apple Music');
      return badges;
    };

    const renderWaveform = (track, size = 'default') => {
      const bars = Array.from({ length: size === 'compact' ? 16 : 24 }, (_, index) => 12 + pseudoRandom(`${track.slug}-${index}`, 48));
      const className = `waveform waveform--${size}`;
      return `<div class="${className}" aria-hidden="true">${bars
        .map((height) => `<span style="height:${height}px"></span>`)
        .join('')}</div>`;
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

    const accessLabel = (track) => {
      const access = (track.access || '').toLowerCase();
      if (access.includes('early')) return 'Ранний доступ';
      if (access.includes('open')) return 'Открытый доступ';
      if (access) return access;
      return 'Открытый релиз';
    };

    const updatePlayerBadges = (track) => {
      if (elements.playerAccess) {
        elements.playerAccess.textContent = accessLabel(track);
        elements.playerAccess.classList.toggle('chip--soon', (track.access || '').includes('early'));
      }
      if (elements.playerLanguages) {
        elements.playerLanguages.textContent = languagesLabel(track.languages);
      }
      if (elements.playerPlays) {
        elements.playerPlays.textContent = track.plays
          ? `${track.plays.toLocaleString('ru-RU')} прослушиваний`
          : 'Новый трек';
      }
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
      }
      state.roles.forEach((role) => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.textContent = role;
        elements.roleBadges.appendChild(span);
      });
      const chipLabel = state.roles.includes('Админ') ? `${state.user.name} · ${state.roles.join(', ')}` : 'Вход на сайт · гость';
      elements.roleChip.textContent = chipLabel;
    };

    const renderProfile = () => {
      elements.profileName.textContent = state.user.name;
      elements.profileMeta.textContent = `ID: ${state.user.id || '—'} · уровень ${state.user.level} · RUZCOIN: ${state.user.ruz} · устройство сохранено`;
      elements.profileToken.textContent = `Токен: ${state.user.token || '—'}`;
      if (elements.profileModalName) elements.profileModalName.textContent = state.user.name || 'Профиль устройства';
      if (elements.profileModalMeta)
        elements.profileModalMeta.textContent = `ID: ${state.user.id || '—'} · уровень ${state.user.level} · RUZCOIN: ${state.user.ruz}`;
      if (elements.profileModalToken) elements.profileModalToken.textContent = `Токен: ${state.user.token || '—'}`;
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
      loadLiked();
    };

    const persistLiked = () => {
      if (!state.user || !state.user.id) return;
      localStorage.setItem(`avzal_liked_${state.user.id}`, JSON.stringify(Array.from(state.liked)));
    };

    const loadLiked = () => {
      if (!state.user || !state.user.id) return;
      const liked = localStorage.getItem(`avzal_liked_${state.user.id}`);
      if (liked) {
        state.liked = new Set(JSON.parse(liked));
      } else {
        state.liked = new Set();
      }
    };

    const renderMobilePreview = (track) => {
      if (!track || !elements.mobileTitle) return;
      const released = isReleased(track);
      const stats = getTrackStats(track);
      elements.mobileCover.src = track.coverPath || getCoverPath(track);
      elements.mobileCover.alt = `Обложка ${track.title}`;
      elements.mobileEyebrow.textContent = released ? 'Вышел' : 'Ранний доступ';
      elements.mobileTitle.textContent = track.title;
      elements.mobileMeta.textContent = `${track.artist || 'AVZALØV'} · ${languagesLabel(track.languages)}`;
      elements.mobileBadge.textContent = released ? 'Live' : 'Early';
      elements.mobileBadge.classList.toggle('pill--live', released);
      elements.mobileBadge.classList.toggle('pill--glass', !released);
      elements.mobilePlays.textContent = `👁️ ${stats.plays.toLocaleString('ru-RU')}`;
      elements.mobileDuration.textContent = `⏱️ ${formatDurationLabel(stats.durationSeconds)}`;
      elements.mobileAccess.textContent = track.hasClip ? '🎬 Клип' : accessLabel(track);
      elements.mobileExplicit.textContent = track.explicit ? '⚠️ Explicit' : '✔️ Clean';
      elements.mobileRelease.textContent = `📅 ${formatReleaseDate(track)}`;
      elements.mobileTags.innerHTML = stats.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
      if (elements.mobilePlay) elements.mobilePlay.dataset.slug = track.slug;
      if (elements.mobileLike) elements.mobileLike.dataset.slug = track.slug;
      if (elements.mobileShare) elements.mobileShare.dataset.slug = track.slug;
    };

    const toggleLike = (slug) => {
      if (state.liked.has(slug)) {
        state.liked.delete(slug);
      } else {
        state.liked.add(slug);
      }
      persistLiked();
      renderTracks();
      renderMobilePreview(state.playlist[state.currentIndex]);
    };

    const shareTrack = async (track) => {
      const url = `${window.location.origin}/#track-${track.slug}`;
      const shareData = {
        title: `${track.artist || 'AVZALØV'} - ${track.title}`,
        text: `Слушай ${track.artist || 'AVZALØV'} - ${track.title} на новой платформе AVZALØV!`,
        url,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(url);
          alert('Ссылка на трек скопирована в буфер обмена!');
        }
      } catch (err) {
        console.error('Share failed:', err);
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        alert('Ссылка на трек скопирована в буфер обмена.');
      }
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
      if (elements.loginStatus) {
        elements.loginStatus.textContent = `${provider.toUpperCase()} · вход в разработке`;
      }
      alert('Авторизация через соцсети пока в разработке. Используйте админ-код.');
    };

    const createTrackCard = (track) => {
      const audioPath = getAudioPath(track);
      const card = document.createElement('article');
      const released = isReleased(track);
      const isLiked = state.liked.has(track.slug);
      const stats = getTrackStats(track);
      const badges = getTrackBadges(track, stats, released);

      card.className = 'track-card track-card--neo';
      card.dataset.trackSlug = track.slug;
      card.innerHTML = `
        <div class="track-card__cover">
          <img src="${getCoverPath(track)}" alt="Обложка ${track.title}" onerror="this.src='img/background.jpg'" />
          <div class="track-card__status ${released ? 'track-card__status--live' : ''}">${released ? 'Вышел' : 'Early'}</div>
          <div class="track-card__badge">${track.type || 'Single'}</div>
          ${track.explicit ? '<div class="track-card__badge track-card__badge--explicit">E</div>' : ''}
        </div>
        <div class="track-card__body">
          <div class="track-card__top">
            <div>
              <h3 class="track-card__title">${track.title}</h3>
              <p class="track-card__artist">${track.artist || 'AVZALØV'}</p>
              <p class="muted tiny">${formatReleaseDate(track)} · ${track.access || 'open'}</p>
            </div>
            <div class="track-card__cta">
              <button class="icon-btn ghost js-play-card" ${audioPath ? '' : 'disabled'} aria-label="Слушать ${track.title}">${icon('play')}</button>
              <button class="icon-btn ghost js-like-card ${isLiked ? 'active' : ''}" aria-label="Нравится">${icon('heart')}</button>
              <button class="icon-btn ghost js-share-card" aria-label="Поделиться">${icon('share')}</button>
              <button class="icon-btn ghost js-info-card" aria-label="Подробнее о треке">${icon('info')}</button>
            </div>
          </div>
          ${
            badges.length
              ? `<div class="track-card__badges-row">${badges
                  .map((badge) => `<span class="pill pill--status">${badge}</span>`)
                  .join('')}</div>`
              : ''
          }
          <p class="muted tiny track-card__lyrics">${track.lyricsPreview || 'Текст появится ближе к релизу. Следите за обновлениями.'}</p>
          <div class="track-card__meta-row track-card__meta-row--icons">
            <span class="chip chip--icon" title="Прослушивания">${icon('eye')}<span>${track.plays?.toLocaleString('ru-RU') || '—'}</span></span>
            <span class="chip chip--icon" title="Дата релиза">${icon('calendar')}<span>${formatReleaseDate(track)}</span></span>
            <span class="chip chip--icon" title="Языки">${icon('language')}<span>${languagesLabel(track.languages)}</span></span>
            ${track.hasClip ? `<span class="chip chip--icon">${icon('clip')}<span>Клип</span></span>` : `<span class="chip chip--icon">${icon('audio')}<span>Аудио</span></span>`}
            ${track.explicit ? `<span class="chip chip--icon chip--alert"><span class="chip__explicit">E</span><span>Explicit</span></span>` : ''}
          </div>
          <div class="track-card__meta-row track-card__meta-row--icons track-card__meta-row--micro">
            <span class="chip chip--icon" title="Лайки">${icon('heart')}<span>${stats.likes.toLocaleString('ru-RU')}</span></span>
            <span class="chip chip--icon" title="Комментарии">${icon('comment')}<span>${stats.comments.toLocaleString('ru-RU')}</span></span>
            <span class="chip chip--icon" title="Ремиксы или репосты">${icon('repeat')}<span>${stats.remixes}</span></span>
            <span class="chip chip--icon" title="Слушатели">${icon('headphones')}<span>${stats.listeners.toLocaleString('ru-RU')}</span></span>
            <span class="chip chip--icon" title="Длительность">${icon('timer')}<span>${formatDurationLabel(stats.durationSeconds)}</span></span>
          </div>
          ${
            stats.tags.length
              ? `<div class="track-card__tags">${stats.tags
                  .map((tag) => `<span class="tag">${tag}</span>`)
                  .join('')}</div>`
              : ''
          }
          ${renderWaveform(track)}
          <div class="track-inline" data-inline-player>
            <div class="track-inline__header">
              <span class="pill pill--status" data-inline-label>Карточка готова к проигрыванию</span>
              <span class="track-inline__time" data-inline-time>0:00</span>
            </div>
            <div class="track-inline__progress"><span data-inline-progress></span></div>
            <div class="track-inline__controls">
              <button class="icon-btn ghost js-play-card" ${audioPath ? '' : 'disabled'} aria-label="Слушать ${track.title}">${icon('play')}</button>
              <button class="icon-btn ghost js-next-card" aria-label="Следующий трек">${icon('repeat')}</button>
              <button class="icon-btn ghost js-info-card" aria-label="Подробнее о треке">${icon('info')}</button>
            </div>
          </div>
          <div class="track-card__meta-row">
            <span class="pill">${track.copyright || '© AVZALØV'}</span>
            <span class="pill pill--glass">${released ? 'Вышел' : 'Ранний доступ'}</span>
          </div>
        </div>
      `;
      const playBtns = card.querySelectorAll('.js-play-card');
      const infoBtns = card.querySelectorAll('.js-info-card');
      const likeBtn = card.querySelector('.js-like-card');
      const shareBtn = card.querySelector('.js-share-card');
      const nextBtn = card.querySelector('.js-next-card');

      playBtns.forEach((btn) => btn.addEventListener('click', () => selectTrackBySlug(track.slug)));
      infoBtns.forEach((btn) => btn.addEventListener('click', () => openTrackModal(track)));
      if (likeBtn) likeBtn.addEventListener('click', () => toggleLike(track.slug));
      if (shareBtn) shareBtn.addEventListener('click', () => shareTrack(track));
      if (nextBtn) nextBtn.addEventListener('click', () => nextTrack());

      return card;
    };

    const createGalleryCard = (track) => {
      const released = isReleased(track);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'gallery-card';
      card.dataset.trackSlug = track.slug;
      card.innerHTML = `
        <div class="gallery-card__cover">
          <img src="${getCoverPath(track)}" alt="${track.title}" onerror="this.src='img/background.jpg'" />
          <span class="gallery-card__status ${released ? 'gallery-card__status--live' : ''}">${released ? 'Вышел' : 'Early'}</span>
        </div>
        <div class="gallery-card__body">
          <div class="gallery-card__titles">
            <strong>${track.title}</strong>
            <p class="muted tiny">${languagesLabel(track.languages)} · ${formatReleaseDate(track)}</p>
          </div>
          <div class="gallery-card__meta">
            <span>${icon('eye')}${track.plays?.toLocaleString('ru-RU') || '—'}</span>
            <span>${icon('timer')}${formatDurationLabel(deriveDurationSeconds(track))}</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => selectTrackBySlug(track.slug));
      return card;
    };

    const renderGallery = (tracks) => {
      if (!elements.tracksGallery) return;
      elements.tracksGallery.innerHTML = '';
      tracks.slice(0, 12).forEach((track) => {
        elements.tracksGallery.appendChild(createGalleryCard(track));
      });
    };

    const renderMobileRail = (tracks) => {
      if (!elements.mobileRail) return;
      elements.mobileRail.innerHTML = '';
      tracks.slice(0, 8).forEach((track) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'mobile-rail__item';
        chip.dataset.trackSlug = track.slug;
        chip.innerHTML = `<span class="mobile-rail__cover">${icon('play')}</span><span>${track.title}</span>`;
        chip.addEventListener('click', () => selectTrackBySlug(track.slug));
        elements.mobileRail.appendChild(chip);
      });
    };

    const renderTracks = () => {
      if (!elements.tracksList) return;

      const access = elements.accessFilter?.value || 'all';
      const language = elements.languageFilter?.value || 'all';

      elements.tracksList.innerHTML = '';
      const filtered = tracksData.filter((track) => {
        const accessValue = track.access || 'open';
        const languages = track.languages || [];
        const accessOk = access === 'all' || accessValue === access;
        const langOk = language === 'all' || languages.includes(language) || languages.length === 0;
        return accessOk && langOk;
      });
      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `
          <h3>Нет треков под фильтры</h3>
          <p class="muted">Сбросьте параметры или выберите другой язык, чтобы увидеть доступные релизы.</p>
        `;
        elements.tracksList.appendChild(empty);
        renderGallery([]);
        renderMobileRail([]);
        return;
      }
      renderGallery(filtered);
      renderMobileRail(filtered);
      filtered.forEach((track) => {
        const card = createTrackCard(track);
        elements.tracksList.appendChild(card);
      });
    };

    const openTrackModal = (track) => {
      if (!elements.trackModalBody) return;
      const release = formatReleaseDate(track);
      const access = track.access ? `Доступ: ${track.access}` : 'Открытый';
      const stats = getTrackStats(track);
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
        <div class="track-modal__meta track-modal__meta--icons">
          <span class="chip chip--icon">${icon('heart')}<span>${stats.likes.toLocaleString('ru-RU')}</span></span>
          <span class="chip chip--icon">${icon('comment')}<span>${stats.comments.toLocaleString('ru-RU')}</span></span>
          <span class="chip chip--icon">${icon('repeat')}<span>${stats.remixes}</span></span>
          <span class="chip chip--icon">${icon('headphones')}<span>${stats.listeners.toLocaleString('ru-RU')}</span></span>
          <span class="chip chip--icon">${icon('timer')}<span>${formatDurationLabel(stats.durationSeconds)}</span></span>
        </div>
        <div class="track-modal__lyrics">${track.lyricsPreview || 'Текст появится позже, следи за обновлениями.'}</div>
        <div class="track-modal__actions">
          <button class="btn primary" ${getAudioPath(track) ? '' : 'disabled'} data-play="${track.slug}">Слушать</button>
          ${track.clipUrl ? `<a class="btn ghost" href="${track.clipUrl}" target="_blank" rel="noreferrer">Клип</a>` : ''}
        </div>
        ${renderWaveform(track, 'compact')}
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

    const updateInlineProgress = () => {
      const track = state.playlist[state.currentIndex];
      if (!track) return;
      const percent = (elements.audio.currentTime / elements.audio.duration) * 100;
      document.querySelectorAll(`[data-track-slug="${track.slug}"] [data-inline-progress]`).forEach((bar) => {
        bar.style.width = Number.isFinite(percent) ? `${percent}%` : '0%';
      });
      document.querySelectorAll(`[data-track-slug="${track.slug}"] [data-inline-time]`).forEach((timeEl) => {
        timeEl.textContent = formatTime(elements.audio.currentTime);
      });
    };

    const updateMobileHub = (track) => {
      if (!track) return;
      if (elements.mobilePlayerTitle) {
        elements.mobilePlayerTitle.textContent = `${track.title} · ${track.artist || 'AVZALØV'}`;
      }
      if (elements.mobilePlayerMeta) {
        elements.mobilePlayerMeta.textContent = `${formatReleaseDate(track)} · ${languagesLabel(track.languages)} · ${accessLabel(track)}`;
      }
      document.querySelectorAll('.gallery-card, .mobile-rail__item').forEach((node) => {
        node.classList.toggle('is-active', node.dataset.trackSlug === track.slug);
      });
    };

    const updateMiniPlayer = (track) => {
      if (!elements.miniPlayer || !track) return;
      elements.miniCover.src = track.coverPath;
      elements.miniTitle.textContent = track.title;
      elements.miniInfo.textContent = `${formatReleaseDate(track)} · ${languagesLabel(track.languages)}`;
      updateMiniProgress(0);
      elements.miniPlayer.classList.add('is-visible');
      elements.miniPlayer.setAttribute('aria-hidden', 'false');
      elements.miniPlayer.classList.remove('is-collapsed');
    };

    const setMiniPlayingState = () => {
      if (!elements.miniPlay) return;
      elements.miniPlay.textContent = state.isPlaying ? '⏸' : '▶';
      elements.miniPlayer?.classList.toggle('is-playing', state.isPlaying);
    };

    const updateMiniProgress = (percent) => {
      if (!elements.miniProgress) return;
      elements.miniProgress.style.width = Number.isFinite(percent) ? `${percent}%` : '0%';
    };

    const hideMiniPlayer = () => {
      if (!elements.miniPlayer) return;
      elements.miniPlayer.classList.remove('is-visible');
      elements.miniPlayer.setAttribute('aria-hidden', 'true');
    };

    const syncActiveCards = () => {
      const current = state.playlist[state.currentIndex];
      document.querySelectorAll('[data-track-slug]').forEach((card) => {
        const isCurrent = current && card.dataset.trackSlug === current.slug;
        card.classList.toggle('is-active', Boolean(isCurrent));
        card.classList.toggle('is-playing', Boolean(isCurrent && state.isPlaying));
        const label = card.querySelector('[data-inline-label]');
        if (label) label.textContent = isCurrent && state.isPlaying ? 'Карточка играет' : 'Карточка готова к проигрыванию';
        if (!isCurrent) {
          const progress = card.querySelector('[data-inline-progress]');
          const timeEl = card.querySelector('[data-inline-time]');
          if (progress) progress.style.width = '0%';
          if (timeEl) timeEl.textContent = '0:00';
        }
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
            <span class="pill ${track.delta >= 0 ? 'pill--up' : 'pill--down'}">${track.sign}${Math.abs(track.delta)}%</span>
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
      updatePlayerBadges(track);
      renderMobilePreview(track);
      renderPlaylist();
      syncActiveCards();
      updateMobileHub(track);
      updateMiniPlayer(track);
      setMiniPlayingState();
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
      elements.playBtn.classList.add('is-playing');
      elements.playerStatus.textContent = 'Сейчас играет';
      elements.miniPlayer?.classList.add('is-visible');
      elements.miniPlayer?.setAttribute('aria-hidden', 'false');
      syncActiveCards();
      setMiniPlayingState();
    };

    const pauseTrack = () => {
      elements.audio.pause();
      state.isPlaying = false;
      elements.playBtn.classList.remove('is-playing');
      elements.playerStatus.textContent = 'Плеер на паузе';
      syncActiveCards();
      setMiniPlayingState();
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
      updateInlineProgress();
      updateMiniProgress(percent);
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
      elements.muteBtn.classList.toggle('is-muted', state.isMuted);
    };

    const changeVolume = () => {
      const volume = Number(elements.volume.value);
      elements.audio.volume = volume;
      state.isMuted = volume === 0;
      elements.muteBtn.classList.toggle('is-muted', state.isMuted);
    };

    const selectTrackBySlug = (slug) => {
      const index = state.playlist.findIndex((item) => item.slug === slug);
      if (index >= 0) {
        setCurrentTrack(index, true);
        return;
      }
      const track = tracksData.find((item) => item.slug === slug);
      if (track && getAudioPath(track)) {
        state.playlist = [{ ...track, audioPath: getAudioPath(track), coverPath: getCoverPath(track) }, ...state.playlist];
        renderPlaylist();
        setCurrentTrack(0, true);
      }
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
        const initials = (msg.user || 'U')
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        item.innerHTML = `
          <div class="chat-message__profile">
            <div class="chat-avatar">${initials}</div>
            <div>
              <div class="chat-identity">
                <strong>${msg.user}</strong>
                <span class="chat-badge">${msg.role}</span>
              </div>
              <p class="muted chat-message__text">${msg.text}</p>
            </div>
          </div>`;
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
      if (!ADMIN_CODES.includes(code)) {
        if (elements.loginStatus) elements.loginStatus.textContent = 'Код не принят. Только 50 сервисных ключей работают.';
        return;
      }
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
      state.purchased.clear();
      saveUsersToState(state.user);
      loadLiked();
      renderProfile();
      renderChat();
      if (elements.loginStatus) elements.loginStatus.textContent = 'Админ-доступ активирован на этом устройстве.';
      closeModal(elements.loginModal);
    };

    const handleLogout = () => {
      state.user = { ...state.user, name: 'Гость', level: 1, ruz: 0, role: 'Слушатель', nameLocked: false };
      state.roles = ['Слушатель'];
      elements.adminCode.value = '';
      saveUsersToState(state.user);
      loadLiked();
      renderProfile();
      renderChat();
      if (elements.loginStatus) elements.loginStatus.textContent = 'Профиль сброшен, вход доступен только по коду.';
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

    const handleProfileAction = (action) => {
      const dropdown = elements.profileDropdown;
      if (dropdown) dropdown.classList.remove('open');
      if (elements.profileToggle) elements.profileToggle.setAttribute('aria-expanded', 'false');
      if (action === 'open-profile') {
        document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
      }
      if (action === 'open-settings') {
        openModal(elements.settingsModal);
      }
      if (action === 'open-chat') {
        openModal(elements.chatModal);
      }
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
      elements.accessFilter?.addEventListener('change', renderTracks);
      elements.languageFilter?.addEventListener('change', renderTracks);
      elements.ctaPlay.addEventListener('click', () => selectTrackBySlug(state.playlist[0]?.slug));
      elements.ctaChat.addEventListener('click', () => openModal(elements.chatModal));
      elements.ctaGame.addEventListener('click', () => document.getElementById('game').scrollIntoView({ behavior: 'smooth' }));
      elements.chartOpenBtn?.addEventListener('click', renderChartModal);
      elements.newsModalBtn?.addEventListener('click', renderNewsModal);
      elements.newsTickerBtn?.addEventListener('click', renderNewsModal);
      elements.mobilePlay?.addEventListener('click', () => {
        const slug = elements.mobilePlay.dataset.slug;
        if (slug) selectTrackBySlug(slug);
      });
      elements.mobileLike?.addEventListener('click', () => {
        const slug = elements.mobileLike.dataset.slug;
        if (slug) toggleLike(slug);
      });
      elements.mobileShare?.addEventListener('click', () => {
        const slug = elements.mobileShare.dataset.slug;
        const track = state.playlist.find((item) => item.slug === slug);
        if (track) shareTrack(track);
      });
      elements.miniPlay?.addEventListener('click', togglePlay);
      elements.miniPrev?.addEventListener('click', prevTrack);
      elements.miniNext?.addEventListener('click', nextTrack);
      elements.miniHide?.addEventListener('click', hideMiniPlayer);
      elements.navToggle?.addEventListener('click', handleNavToggle);
      document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', closeMobileNav));
      if (elements.profileToggle && elements.profileDropdown) {
        elements.profileToggle.addEventListener('click', () => {
          const isOpen = elements.profileToggle.getAttribute('aria-expanded') === 'true';
          elements.profileToggle.setAttribute('aria-expanded', String(!isOpen));
          elements.profileDropdown.classList.toggle('open', !isOpen);
        });
        elements.profileDropdown.querySelectorAll('[data-action]').forEach((btn) => {
          btn.addEventListener('click', () => handleProfileAction(btn.dataset.action));
        });
      }
      document.querySelectorAll('[data-social]').forEach((btn) => {
        btn.addEventListener('click', () => applySocialProfile(btn.dataset.social || 'social'));
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
      [elements.chatModal, elements.loginModal, elements.settingsModal, elements.chartModal, elements.trackModal, elements.newsModal, elements.profileModal].forEach((modal) => {
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
            elements.profileModal,
          ].forEach((modal) => closeModal(modal));
          closeMobileNav();
        }
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMobileNav();
      });
    };

    const handleNavToggle = () => {
      if (!elements.navToggle || !elements.mainNav) return;
      const expanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      elements.navToggle.setAttribute('aria-expanded', String(next));
      elements.mainNav.classList.toggle('is-open', next);
      document.body.classList.toggle('nav-open', next);
    };

    const closeMobileNav = () => {
      if (!elements.navToggle || !elements.mainNav) return;
      elements.navToggle.setAttribute('aria-expanded', 'false');
      elements.mainNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };

    const observeBottomNav = () => {
      const links = Array.from(document.querySelectorAll('.bottom-nav__item'));
      if (!links.length) return;

      const sections = links
        .map((link) => ({ link, section: document.getElementById(link.dataset.nav || '') }))
        .filter((item) => Boolean(item.section));

      const activate = (id) => {
        links.forEach((lnk) => lnk.classList.toggle('active', lnk.dataset.nav === id));
      };

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]) activate(visible[0].target.id);
        },
        { threshold: 0.35, rootMargin: '-40% 0px -40% 0px' }
      );

      sections.forEach((item) => observer.observe(item.section));
      if (sections[0]) activate(sections[0].section.id);
      links.forEach((link) => link.addEventListener('click', () => activate(link.dataset.nav || '')));
    };

    const init = async () => {
      await bootstrapUser();
      renderStats();
      renderTracks();
      buildPlaylist();
      renderProfile();
      renderChat();
      observeBottomNav();
      bindEvents();
      setCurrentTrack(0);
      changeVolume();
      updateClock();
      renderNewsTicker();
      setInterval(updateClock, 1000);
      setInterval(renderNewsTicker, 5000);
    };

    init();
  })();
});