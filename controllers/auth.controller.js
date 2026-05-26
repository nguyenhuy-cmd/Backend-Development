import { registerUser, loginUser } from '../services/authServices.js';
import User from '../models/user.js';
import asyncHandler from '../utils/asyncHandler.js';

const authController = {
    register: asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const user = await registerUser(name, email, password);

        res.cookie('token', user.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            user,
            token: user.token
        });
    }),

    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await loginUser(email, password);

        res.cookie('token', user.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Đăng nhập thành công',
            user,
            token: user.token
        });
    }),

    getMe: asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); 
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})
};
   

export default authController;
