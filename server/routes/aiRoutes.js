const express = require('express');
const router = express.Router();
const {
    getFlowerRecommendation,
    chatWithAI,
    generateDescription,
    generateCardMessage
} = require('../controllers/aiController');

router.post('/recommend', getFlowerRecommendation);
router.post('/chat', chatWithAI);
router.post('/describe', generateDescription);
router.post('/message', generateCardMessage);

module.exports = router;
