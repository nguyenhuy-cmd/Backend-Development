import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

export const registerUser = async (name, email, password,otp, otpExpires ) => {
    const userExist = await User.findOne({ email });
    if (userExist) throw new Error('Email đã tồn tại');

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        otp,
        otpExpires,
    });

    await user.save();

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
    };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    
    if (!user)
        throw new Error('Email không tồn tại');
    
    if (!user.isVerified){
    const error = new Error('Tài khoản chưa được xác thực email');
    error.statusCode = 403;
    throw error;}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new Error('Mật khẩu không chính xác');

    await user.save();
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
    };
}