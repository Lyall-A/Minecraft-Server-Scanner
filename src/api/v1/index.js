const express = require('express');

const router = express.Router();

router.use(express.json());
router.use('/scan', require('./scan'));

module.exports = router;