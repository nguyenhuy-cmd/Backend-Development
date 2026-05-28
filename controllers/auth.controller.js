import { registerUser, loginUser } from '../services/authServices.js';
import User from '../models/user.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';

const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresTime = new Date(Date.now() + 5 * 60 * 1000);
    const user = await registerUser( name, email, password, otpCode, otpExpiresTime );
    const message = `Chào mừng bạn! Mã OTP xác thực tài khoản của bạn là: ${otpCode}. Mã này sẽ hết hạn trong 5 phút.`;
    await sendEmail(user.email, 'Mã xác thực tài khoản', message);

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
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json(user);
  })
};

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

  
  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Mã OTP không chính xác' });
  }


  if (user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.' });
  }

  
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Xác thực thành công! Giờ bạn có thể đăng nhập.' });
});
export default authController;
