import User from '../models/user.js';
import asyncHandler from '../utils/asyncHandler.js';
import Post from '../models/Post.js';

const postController = {
    createPost: asyncHandler(async(req, res)=> {
        const {title, content, category, images} = req.body;
        const author = req.user._id;
        await Post.create({title, content, category, images, author});
        res.status(201).json({message:"Tạo bài viết thành công"})
    }),

    getAllPosts: asyncHandler(async(req,res)=> {
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
    }),
    getPost: asyncHandler(async(req, res)=>{
        const {id} = req.params;
        const post = await Post.findById(id).populate('author', 'name avatar');
        res.status(200).json(post);
    }),
    deletePost: asyncHandler(async(req, res)=>{
        const {id} = req.params;
        const post = await Post.findByIdAndDelete(id);
        res.status(200).json({message: "Xóa bài viết thành công"});
    }), 
    updatePost: asyncHandler(async(req, res)=>{
      const {id} = req.params;
      const { title, content, category } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bài viết này' });
    }
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    await post.save();

    res.status(200).json({ message: 'Cập nhật thành công', post });
    })

} 
export default postController;