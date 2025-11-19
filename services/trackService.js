const fs = require('fs/promises');
const path = require('path');
const HttpError = require('../utils/httpError');

const tracksFile = process.env.TRACKS_FILE || path.join(__dirname, '..', 'data', 'all-tracks.json');
const trackIdsFile = process.env.TRACK_IDS_FILE || path.join(__dirname, '..', 'data', 'track-ids.json');

async function readJson(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeJson(filePath, payload) {
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

function generateTrackId(existingIds = []) {
  const base = Math.floor(Math.random() * 900) + 100;
  const nextNumber = existingIds.length + 1 + base;
  return `TRK-${String(nextNumber).padStart(3, '0')}`;
}

function combineTracks(tracks, ids) {
  return ids.map((trackIdEntry, index) => {
    const meta = tracks[index] || {};
    return {
      id: trackIdEntry.id,
      slug: trackIdEntry.slug,
      title: meta.title || trackIdEntry.slug,
      release: meta.release || null,
    };
  });
}

async function getAllTracks() {
  const [tracks, ids] = await Promise.all([
    readJson(tracksFile),
    readJson(trackIdsFile),
  ]);

  return combineTracks(tracks, ids);
}

async function getTrackBySlug(slug) {
  const [tracks, ids] = await Promise.all([
    readJson(tracksFile),
    readJson(trackIdsFile),
  ]);

  const trackIndex = ids.findIndex((item) => item.slug === slug);
  if (trackIndex === -1) {
    throw new HttpError(404, 'Track not found');
  }

  const combined = combineTracks(tracks, ids);
  return combined[trackIndex];
}

async function createTrack(payload) {
  if (!payload.slug || !payload.title) {
    throw new HttpError(400, 'Missing required fields: slug, title');
  }

  const [tracks, ids] = await Promise.all([
    readJson(tracksFile),
    readJson(trackIdsFile),
  ]);

  const slugExists = ids.some((item) => item.slug === payload.slug);
  if (slugExists) {
    throw new HttpError(409, 'Track with this slug already exists');
  }

  const newId = generateTrackId(ids);
  const newTrackMeta = { title: payload.title, release: payload.release || 'Скоро' };
  const newTrackIdEntry = { id: newId, slug: payload.slug };

  tracks.push(newTrackMeta);
  ids.push(newTrackIdEntry);

  await Promise.all([
    writeJson(tracksFile, tracks),
    writeJson(trackIdsFile, ids),
  ]);

  return { ...newTrackMeta, ...newTrackIdEntry };
}

async function updateTrack(slug, updates) {
  const [tracks, ids] = await Promise.all([
    readJson(tracksFile),
    readJson(trackIdsFile),
  ]);

  const trackIndex = ids.findIndex((item) => item.slug === slug);
  if (trackIndex === -1) {
    throw new HttpError(404, 'Track not found');
  }

  const currentMeta = tracks[trackIndex] || {};
  const updatedMeta = {
    ...currentMeta,
    title: updates.title || currentMeta.title,
    release: updates.release || currentMeta.release,
  };

  tracks[trackIndex] = updatedMeta;
  ids[trackIndex] = { ...ids[trackIndex], slug: updates.slug || ids[trackIndex].slug };

  await Promise.all([
    writeJson(tracksFile, tracks),
    writeJson(trackIdsFile, ids),
  ]);

  return combineTracks(tracks, ids)[trackIndex];
}

async function deleteTrack(slug) {
  const [tracks, ids] = await Promise.all([
    readJson(tracksFile),
    readJson(trackIdsFile),
  ]);

  const trackIndex = ids.findIndex((item) => item.slug === slug);
  if (trackIndex === -1) {
    throw new HttpError(404, 'Track not found');
  }

  tracks.splice(trackIndex, 1);
  ids.splice(trackIndex, 1);

  await Promise.all([
    writeJson(tracksFile, tracks),
    writeJson(trackIdsFile, ids),
  ]);

  return { success: true };
}

module.exports = {
  getAllTracks,
  getTrackBySlug,
  createTrack,
  updateTrack,
  deleteTrack,
};
