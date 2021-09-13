const express = require('express');
const router = express.Router();

// Administration Route
router.use('/admin', require('./routes/adminRoute'));

// Business Route
router.use('/business', require('./routes/businessRoute'));

module.exports = router;