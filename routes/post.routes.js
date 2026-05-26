import express from 'express';
import postController from '../controllers/post.controller.js';
import { validatePost } from '../validation/postValidation.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/create', authMiddleware, validatePost, postController.createPost);
router.get('/all', postController.getAllPosts);
router.get('/:id', postController.getPost);
router.put('/:id', authMiddleware, validatePost, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

export default router;