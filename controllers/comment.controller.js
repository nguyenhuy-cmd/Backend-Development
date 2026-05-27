import asyncHandler from '../utils/asyncHandler.js';
import * as commentService from '../services/commentServices.js';

const commentController = {
    createComment: asyncHandler(async (req, res) => {
        const { content } = req.body;
        const { postId } = req.params;
        const userId = req.user._id;
        const comment = await commentService.createComment(content, postId, userId);
        res.status(201).json({ message: 'Tạo bình luận thành công', comment });
    }),
    getCommentByPostId: asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const comments = await commentService.getCommentByPostId(postId);
        res.status(200).json({ message: 'Lấy bình luận thành công', comments });
    }),
    updateComment: asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;
        const comment = await commentService.updateComment(commentId, content, userId);
        res.status(200).json({ message: 'Cập nhật bình luận thành công', comment });
    }),
    deleteComment: asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        const userId = req.user._id;
        await commentService.deleteComment(commentId, userId);
        res.status(200).json({ message: 'Xóa bình luận thành công' });
    }),
     toggleLikeComment: asyncHandler(async (req, res) => {
    const { id } = req.params;  
    const userId = req.user._id; 

    const result = await commentService.toggleLike(id, userId);

    res.status(200).json({
      message: result.isLiked ? 'Đã thích bài viết thành công' : 'Đã hủy thích bài viết',
      likesCount: result.likesCount,
      dislikesCount: result.dislikesCount
    });
  }),
  toggleDislikeComment: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    
    const result = await commentService.toggleDislike(id, userId);

    res.status(200).json({
      message: result.isDisliked ? 'Đã chê bài viết thành công' : 'Đã hủy chê bài viết',
      likesCount: result.likesCount,
      dislikesCount: result.dislikesCount
    });
  })
};

export default commentController;