const express = require('express');
const { crawlUrls } = require('../controllers/crawlerController.js');

const router = express.Router();

// Route to handle crawling requests
router.post('/crawl', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const urls = await crawlUrls(url);
        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while crawling the website' });
    }
});

module.exports = router;
