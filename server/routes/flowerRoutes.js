const express = require('express');
const router = express.Router();
const {
  getFlowers,
  getFlowerById,
  createFlower,
  updateFlower,
  updateStock,
  deleteFlower,
  createFlowerReview
} = require('../controllers/flowerController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getFlowers);
router.get('/:id', getFlowerById);
router.post('/:id/reviews', protect, createFlowerReview);
router.post('/', protect, admin, createFlower);
router.put('/:id', protect, admin, updateFlower);
router.patch('/:id/stock', protect, admin, updateStock);
router.delete('/:id', protect, admin, deleteFlower);

module.exports = router;
