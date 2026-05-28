import express from 'express';
import postController from '../controllers/post.controller.js';
import { validatePost } from '../validation/postValidation.js';
import authMiddleware from '../middlewares/authMiddlewares.js';
import commentController from '../controllers/comment.controller.js';
import { validateComment } from '../validation/commentValidation.js';
import upload from '../middlewares/uploadMiddleware.js';
const router = express.Router();

// Upload middleware phải đặt TRƯỚC validatePost để parse form-data
router.post('/', authMiddleware, upload.single('image'), validatePost, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);
router.put('/:id', authMiddleware, validatePost, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.post('/:id/like', authMiddleware, postController.toggleLikePost);
router.post('/:id/dislike', authMiddleware, postController.toggleDislikePost);
router.get('/:postId/comments', commentController.getCommentByPostId);
router.post('/:postId/comments', authMiddleware, validateComment, commentController.createComment);
export default router;