const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const user = await User.create({
    fullName,
    username,
    email,
    password,
    isVerified: true,
    verificationToken,
    verificationTokenExpiry
  });

  if (user) {
    // Try sending verification email, but don't block registration if it fails
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #2D4F1E; text-align: center;">Welcome to Kevin's Blooms!</h2>
          <p>Hi ${fullName.split(' ')[0]},</p>
          <p>Thank you for joining our midnight garden. You can now start shopping.</p>
          <p>Stay blooming,<br>Kevin & The Team</p>
        </div>
      `;

      await sendEmail({
        email: user.email,
        subject: 'Welcome to Kevin\'s Blooms!',
        html
      });
    } catch (emailError) {
      console.error('Email send error (non-fatal):', emailError.message);
    }

    // Generate auth token for auto-login
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: true,
        token
      }
      });
    }
  };


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (user && (await user.comparePassword(password))) {
    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token.');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully! You can now log in.'
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail
};
