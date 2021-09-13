const express = require('express');
const router = express.Router();

// API Version 1.0
router.use('/v1', require('./v1'));

module.exports = router;