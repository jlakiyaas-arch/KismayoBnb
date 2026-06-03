import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import User from '../models/User.js';

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({ name, email, password, role });
  sendTokenResponse(user, 201, res, 'Registration successful');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendTokenResponse(user, 200, res, 'Login successful');
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(avatar && { avatar }) },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: { user },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Clear token on the client.',
  });
});
