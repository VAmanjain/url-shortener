const express = require('express');
const {handleGenerateNewURL, handleGetAnalytics} = require("../Controller/urls")
const router = express.Router();

router.post('/', handleGenerateNewURL);

router.get('/analytics/:shortId', handleGetAnalytics )

module.exports = router;