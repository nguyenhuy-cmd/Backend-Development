import Comment from '../models/Comment.js';

export const createComment = async (content, postId, userId) => {
    const comment = await Comment.create({
        content,
        post: postId,
        author: userId,
    });
    return comment;
};

export const getCommentByPostId = async (postId) => {
    const comments = await Comment.find({ post: postId })
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 });
    return comments;
};

export const updateComment = async (commentId, content, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        const error = new Error('Không tìm thấy bình luận');
        error.statusCode = 404;
        throw error;
    }
    if (!comment.author.equals(userId)) {
        const error = new Error('Bạn không có quyền sửa bình luận này');
        error.statusCode = 403;
        throw error;
    }
    comment.content = content;
    await comment.save();
    return comment;
};

export const deleteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        const error = new Error('Không tìm thấy bình luận');
        error.statusCode = 404;
        throw error;
    }
    if (!comment.author.equals(userId)) {
        const error = new Error('Bạn không có quyền xóa bình luận này');
        error.statusCode = 403;
        throw error;
    }
    await comment.deleteOne();
    return comment;
};

export const toggleLike = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error('Không tìm thấy bình luận');
      error.statusCode = 404;
      throw error;
    }

    const isLiked = comment.likes.some(id=>id.toString() === userId);
    const isDisliked = comment.dislikes.some(id=>id.toString() === userId);

    if (isLiked) {
      comment.likes.pull(userId); 
    } else {
      comment.likes.push(userId); 
      if (isDisliked) comment.dislikes.pull(userId); 
    }

    await comment.save();
    return {
      isLiked: !isLiked,
      likesCount: comment.likes.length,
      dislikesCount: comment.dislikes.length
    };
}

export const toggleDislike = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error('Không tìm thấy bình luận');
      error.statusCode = 404;
      throw error;
    }

    const isLiked = comment.likes.some(id=>id.toString() === userId);
    const isDisliked = comment.dislikes.some(id=>id.toString() === userId);

    if (isDisliked) {
      comment.dislikes.pull(userId); 
    } else {
      comment.dislikes.push(userId); 
      if (isLiked) comment.likes.pull(userId); 
    }

    await comment.save();
    return {
      isDisliked: !isDisliked,
      likesCount: comment.likes.length,
      dislikesCount: comment.dislikes.length
    };
  }
