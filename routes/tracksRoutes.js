const express = require('express');
const {
  listTracks,
  getTrack,
  createTrack,
  updateTrack,
  removeTrack,
  methodNotAllowed,
} = require('../controllers/tracksController');

const router = express.Router();

router
  .route('/')
  .get(listTracks)
  .post(createTrack)
  .all(methodNotAllowed);

router
  .route('/:slug')
  .get(getTrack)
  .put(updateTrack)
  .delete(removeTrack)
  .all(methodNotAllowed);

module.exports = router;
