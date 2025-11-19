const trackService = require('../services/trackService');
const HttpError = require('../utils/httpError');

async function listTracks(req, res, next) {
  try {
    const tracks = await trackService.getAllTracks();
    res.status(200).json({ data: tracks });
  } catch (error) {
    next(error);
  }
}

async function getTrack(req, res, next) {
  try {
    const track = await trackService.getTrackBySlug(req.params.slug);
    res.status(200).json({ data: track });
  } catch (error) {
    next(error);
  }
}

async function createTrack(req, res, next) {
  try {
    const created = await trackService.createTrack(req.body);
    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
}

async function updateTrack(req, res, next) {
  try {
    const updated = await trackService.updateTrack(req.params.slug, req.body);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
}

async function removeTrack(req, res, next) {
  try {
    const result = await trackService.deleteTrack(req.params.slug);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

// Generic handler for unsupported methods
function methodNotAllowed(req, res, next) {
  next(new HttpError(405, 'Method not allowed'));
}

module.exports = {
  listTracks,
  getTrack,
  createTrack,
  updateTrack,
  removeTrack,
  methodNotAllowed,
};
