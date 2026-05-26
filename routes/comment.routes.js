import authMiddleware from '../middlewares/authMiddlewares.js';
import express from 'express';
import commentController from '../controllers/comment.controller.js';
import { validateComment } from '../validation/commentValidation.js';

const router = express.Router();

router.post('/:postId', authMiddleware, validateComment, commentController.createComment);
router.get('/:postId', commentController.getCommentByPostId);
router.put('/:commentId', authMiddleware, validateComment, commentController.updateComment);
router.delete('/:commentId', authMiddleware, commentController.deleteComment);
router.post('/:commentId/like', authMiddleware, commentController.likeComment);

export default router;
