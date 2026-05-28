import Post from '../models/Post.js';


export const createPost = async (title, content, category, author, images) => {
    const newPost = new Post({
    title,
    content,
    category,
    author,
    image: images 
  });
  await newPost.save();
    return newPost;
};


export const getAllPosts = async (page = 1, limit = 10, search = '', category = '') => {
    const filter = {};
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ];
    }
    if (category) {
        filter.category = category;
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
        .populate('author', 'name avatar') 
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    return {
        posts,
        totalPages,
        currentPage: page,
        total: totalPosts
    };
};

export const getPostById = async (id) => {
    const post = await Post.findById(id).populate('author', 'name avatar');
    if (!post) {
        const error = new Error('Bài viết không tồn tại');
        error.statusCode = 404;
        throw error;
    }
    const postObj = post.toObject();
    postObj.likeCount = post.likes.length;     // ✅ thêm
    postObj.dislikeCount = post.dislikes.length;
    return postObj;
};
export const updatePost = async (id, userId, updateData) => {
    const post = await Post.findById(id);
    if (!post) {
        const error = new Error('Không tìm thấy bài viết');
        error.statusCode = 404;
        throw error;
    }
    if (!post.author.equals(userId)) {
        const error = new Error('Bạn không có quyền sửa bài viết này');
        error.statusCode = 403;
        throw error;
    }

    const { title, content, category, image } = updateData;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (image !== undefined) post.image = image;
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
    if (!post.author.equals(userId)) {
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