import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

export const createPost = async (title, content, category, author, images) => {
    const post = new Post({
        title,
        content,
        category,
        author,
        images
    });
    await post.save();
    return post;
};
 export const getAllPost = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

            const filter = {};
            if(search) {
                filter.$or = [
                    {title: {$regex: search, $options: 'i'}},
                    {content: {$regex: search, $options: 'i'}}
                ]
            }

            const skip = (page - 1) * limit;

            const allPosts = await Post.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

            const totalPosts = await Post.countDocuments(filter);
            const totalPages = Math.ceil(totalPosts / limit);

            res.status(200).json({
                allPosts,
                pagination: {
                    page,
                    limit,
                    totalPosts,
                    totalPages
                }
            });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bài đăng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
 }
 export const getByIdPost = async(req, res)=> {
    const {id} = req.params;
    const post = await Post.findById(id).populate('author', 'name avatar');
    if (!post) {
        return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    res.status(200).json(post);
 }
 export const updatePost = async(req, res)=> {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body, {new: true});
    if (!post) {
        return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    res.status(200).json(post);
 }
 export const deletePost = async(req, res)=> {
    const {id} = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
        return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    res.status(200).json(post);
 }