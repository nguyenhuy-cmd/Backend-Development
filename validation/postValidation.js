import joi from 'joi';

const postSchema = joi.object({
    title: joi.string().min(3).max(100).required().messages({
        'string.empty': 'Tiêu đề không được để trống',
        'string.min': 'Tiêu đề phải có ít nhất 3 ký tự',
        'any.required': 'Tiêu đề là bắt buộc'
    }),
    content: joi.string().min(10).required().messages({
        'string.empty': 'Nội dung không được để trống',
        'string.min': 'Nội dung phải có ít nhất 10 ký tự',
        'any.required': 'Nội dung là bắt buộc'
    }),
    category: joi.string().required().messages({
        'string.empty': 'Danh mục không được để trống',
        'any.required': 'Danh mục là bắt buộc'
    })
});

export const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessage = error.details.map((err) => err.message);
        return res.status(400).json({ errors: errorMessage });
    }
    
    next();
};
