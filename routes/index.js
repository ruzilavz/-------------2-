const express = require('express');
const healthRoutes = require('./healthRoutes');
const tracksRoutes = require('./tracksRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/tracks', tracksRoutes);

module.exports = router;
