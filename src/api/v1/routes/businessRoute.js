const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.json({
        version: 1.0,
        route: "business"
    });
});

module.exports = router;