const PromoCode = require('../models/PromoCode');

// @desc    Validate a promo code
// @route   POST /api/promo/validate
// @access  Private
const validatePromoCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Please provide a promo code');
  }

  const promo = await PromoCode.findOne({ 
    code: code.toUpperCase(),
    isActive: true,
    expiryDate: { $gt: Date.now() }
  });

  if (promo) {
    res.json({
      success: true,
      data: {
        code: promo.code,
        discount: promo.discount
      }
    });
  } else {
    res.status(404);
    throw new Error('Invalid or expired promo code');
  }
};

module.exports = { validatePromoCode };
