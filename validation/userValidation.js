import joi from 'joi';


export const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required().messages({
        'string.empty': 'Tên không được để trống',
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'any.required': 'Tên là bắt buộc'
    }),
    email: joi.string().email().lowercase().trim().required().messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
        }),
    password: joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu không được để trống',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

export const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.empty': 'Vui lòng nhập Email',
        'string.email': 'Email không hợp lệ'
    }),
    password: joi.string().required().messages({
        'string.empty': 'Vui lòng nhập Mật khẩu'
    })
});

export const validateData = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }
    
    next(); 
  };
};
export const forgotPasswordSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.empty': 'Vui lòng nhập email',
        'string.email': 'Email không hợp lệ'
    })
});

export const resetPasswordSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.empty': 'Vui lòng nhập email',
        'string.email': 'Email không hợp lệ'
    }),
    otp: joi.string().length(6).required().messages({
        'string.empty': 'Vui lòng nhập mã OTP',
        'string.length': 'Mã OTP phải có 6 ký tự'
    }),
    newPassword: joi.string().min(6).required().messages({
        'string.empty': 'Vui lòng nhập mật khẩu mới',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
    })
});