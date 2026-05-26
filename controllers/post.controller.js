import asyncHandler from '../utils/asyncHandler.js';
import * as postService from '../services/postServices.js';

const postController = {
    createPost: asyncHandler(async (req, res) => {
        const { title, content, category, images } = req.body;
        const author = req.user._id;
        await postService.createPost(title, content, category, author, images);
        res.status(201).json({ message: 'Tạo bài viết thành công' });
    }),

    getAllPosts: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const result = await postService.getAllPosts(page, limit, search);
        res.status(200).json(result);
    }),

    getPost: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        res.status(200).json(post);
    }),

    deletePost: asyncHandler(async (req, res) => {
        const { id } = req.params;
        await postService.deletePost(id, req.user._id);
        res.status(200).json({ message: 'Xóa bài viết thành công' });
    }),
    updatePost: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        const post = await postService.updatePost(id, req.user._id, updateData);
        res.status(200).json({ message: 'Cập nhật thành công', post });
    })
};

export default postController;