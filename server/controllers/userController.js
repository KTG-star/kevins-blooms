const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json({ success: true, data: users });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist');

  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user && (await user.comparePassword(oldPassword))) {
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } else {
    res.status(401);
    throw new Error('Invalid old password');
  }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:id
// @access  Private
const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const flowerId = req.params.id;

  if (!user.wishlist.includes(flowerId)) {
    user.wishlist.push(flowerId);
    await user.save();
  }

  res.json({ success: true, message: 'Added to wishlist', data: user.wishlist });
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const flowerId = req.params.id;

  user.wishlist = user.wishlist.filter(id => id.toString() !== flowerId);
  await user.save();

  res.json({ success: true, message: 'Removed from wishlist', data: user.wishlist });
};

// @desc    Update profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
const updateProfilePicture = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image');
    }

    user.profilePicture = req.file.path;
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        profilePicture: updatedUser.profilePicture
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  changePassword,
  addToWishlist,
  removeFromWishlist
};
