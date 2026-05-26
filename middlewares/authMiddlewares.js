import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).json({ error: 'Không có quyền truy cập' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Không có quyền truy cập' });
    }
};
export default authMiddleware;