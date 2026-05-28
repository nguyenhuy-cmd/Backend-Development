import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true, // Không cho phép trùng email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150', // URL ảnh mặc định
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
  },
  isVerified: { 
    type: Boolean, 
    default: false // Mặc định mới tạo tài khoản là chưa xác thực
  },
  otp: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpires: { 
    type: Date,
    default: null,
  }}, {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);
export default User;