(function () {
  const chartEl = document.getElementById('chart');
  const commentsEl = document.getElementById('comments');

  const tracks = (window.RELEASED_TRACKS_DATA || []).slice(0, 9);

  const languagesLabel = (langs) => (langs ? langs.join(' / ') : 'multi');

  const createTrackCard = (track) => {
    const card = document.createElement('article');
    card.className = 'track-card';

    const top = document.createElement('div');
    top.className = 'track-card__top';
    const title = document.createElement('h3');
    title.className = 'track-card__title';
    title.textContent = track.title;
    const price = document.createElement('span');
    price.className = 'chip';
    price.textContent = track.price === 0 ? 'Free' : `${track.price} RC`;
    top.append(title, price);

    const meta = document.createElement('div');
    meta.className = 'track-card__meta';
    const release = document.createElement('span');
    release.className = 'chip chip--soon';
    release.textContent = track.releaseDate || 'Скоро';
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

    card.append(top, meta, footer);
    return card;
  };

  const createCommentCard = (track, index) => {
    const card = document.createElement('article');
    card.className = 'comment-card';

    const header = document.createElement('div');
    header.className = 'comment-card__header';
    const avatar = document.createElement('div');
    avatar.className = 'bot-avatar';
    avatar.textContent = 'AI';
    const info = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'label';
    name.textContent = `Бот-куратор #${index + 1}`;
    const target = document.createElement('p');
    target.className = 'muted';
    target.textContent = `Обсуждает: ${track.title}`;
    info.append(name, target);
    header.append(avatar, info);

    const body = document.createElement('p');
    body.className = 'muted';
    body.textContent = 'Добавьте свой комментарий или поставьте лайк, чтобы поднять трек в чарте.';

    const actions = document.createElement('div');
    actions.className = 'comment-card__actions';
    const like = document.createElement('button');
    like.className = 'btn tiny primary';
    like.textContent = 'Лайк';
    const reply = document.createElement('button');
    reply.className = 'btn tiny ghost';
    reply.textContent = 'Коммент';
    actions.append(like, reply);

    card.append(header, body, actions);
    return card;
  };

  tracks.forEach((track) => chartEl.appendChild(createTrackCard(track)));
  tracks.slice(0, 6).forEach((track, idx) => commentsEl.appendChild(createCommentCard(track, idx)));
})();
