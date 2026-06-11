const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture,
  changePassword,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, admin, getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/profile-picture', protect, upload.single('image'), updateProfilePicture);
router.put('/password', protect, changePassword);
router.post('/wishlist/:id', protect, addToWishlist);
router.delete('/wishlist/:id', protect, removeFromWishlist);

module.exports = router;
