import joi from 'joi';

const commentSchema = joi.object({
    content: joi.string().min(1).required().messages({
        'string.empty': 'Nội dung không được để trống',
        'string.min': 'Nội dung phải có ít nhất 1 ký tự',
        'any.required': 'Nội dung là bắt buộc'
    })
});

export const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessage = error.details.map((err) => err.message);
        return res.status(400).json({ errors: errorMessage });
    } 
    next();
};
