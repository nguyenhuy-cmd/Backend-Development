import authMiddleware from '../middlewares/authMiddlewares.js';
import express from 'express';
import commentController from '../controllers/comment.controller.js';
import { validateComment } from '../validation/commentValidation.js';

const router = express.Router();


router.put('/:commentId', authMiddleware, validateComment, commentController.updateComment);
router.delete('/:commentId', authMiddleware, commentController.deleteComment);
router.post('/:commentId/like', authMiddleware, commentController.toggleLikeComment);
router.post('/:commentId/dislike', authMiddleware, commentController.toggleDislikeComment);
export default router;
