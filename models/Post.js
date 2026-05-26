import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề bài viết'],
      trim: true,
      index: true, 
    },
    content: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung bài viết'],
    },
    category: {
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      enum: ['Công nghệ', 'Đời sống', 'Học tập', 'Giải trí', 'Khác'],
      default: 'Khác',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;