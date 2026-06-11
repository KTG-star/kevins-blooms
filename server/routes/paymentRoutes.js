const express = require('express');
const router = express.Router();
const { verifyPayment, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/verify/:reference', protect, verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;
