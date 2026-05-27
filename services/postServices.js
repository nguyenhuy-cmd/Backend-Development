import Post from '../models/Post.js';


export const createPost = async (title, content, category, author, images) => {
    const post = await Post.create({ title, content, category, author, images });
    return post;
};


export const getAllPosts = async (page = 1, limit = 10, search = '') => {
    const filter = {};
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    const allPosts = await Post.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    return {
        allPosts,
        pagination: { page, limit, totalPosts, totalPages }
    };
};

export const getPostById = async (id) => {
    const post = await Post.findById(id).populate('author', 'name avatar');
    if (!post) {
        const error = new Error('Bài viết không tồn tại');
        error.statusCode = 404;
        throw error;
    }
    return post;
};
export const updatePost = async (id, userId, updateData) => {
    const post = await Post.findById(id);
    if (!post) {
        const error = new Error('Không tìm thấy bài viết');
        error.statusCode = 404;
        throw error;
    }
    if (post.author.toString() !== userId) {
        const error = new Error('Bạn không có quyền sửa bài viết này');
        error.statusCode = 403;
        throw error;
    }

    const { title, content, category } = updateData;
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    await post.save();
    return post;
};


export const deletePost = async (id, userId) => {

    const post = await Post.findById(id);
    if (!post) {
        const error = new Error('Bài viết không tồn tại');
        error.statusCode = 404;
        throw error;
    }
    if (post.author.toString() !== userId) {
        const error = new Error('Bạn không có quyền xóa bài viết này');
        error.statusCode = 403;
        throw error;
    }

    await post.deleteOne();
    return post;
};

export const toggleLike = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Không tìm thấy bài viết');
      error.statusCode = 404;
      throw error;
    }

    const isLiked = post.likes.some(id=>id.toString() === userId);
    const isDisliked = post.dislikes.some(id=>id.toString() === userId);

    if (isLiked) {
      post.likes.pull(userId); 
    } else {
      post.likes.push(userId); 
      if (isDisliked) post.dislikes.pull(userId); 
    }

    await post.save();
    return {
      isLiked: !isLiked,
      likesCount: post.likes.length,
      dislikesCount: post.dislikes.length
    };
};
 
export const toggleDislike = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Không tìm thấy bài viết');
      error.statusCode = 404;
      throw error;
    }

    const isLiked = post.likes.some(id=>id.toString() === userId);
    const isDisliked = post.dislikes.some(id=>id.toString() === userId);

    if (isDisliked) {
      post.dislikes.pull(userId); 
    } else {
      post.dislikes.push(userId); 
      if (isLiked) post.likes.pull(userId); 
    }

    await post.save();
    return {
      isDisliked: !isDisliked,
      likesCount: post.likes.length,
      dislikesCount: post.dislikes.length
    };
  }