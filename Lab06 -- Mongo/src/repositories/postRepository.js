import Post from "../models/Post.js";

class PostRepository {
  async create(post) {
    return await Post.create(post);
  }

  async findAll() {
    return await Post.find().populate("user");
  }

  async findByUser(userId) {
    return await Post.find({ user: userId }).populate("user");
  }

  // 🔥 Agrega este método para obtener un post por ID
  async findById(postId) {
    return await Post.findById(postId).populate("user");
  }

  async update(postId, postData) {
    postData.updatedAt = Date.now(); // actualiza la fecha
    return await Post.findByIdAndUpdate(postId, postData, { new: true });
  }

  async delete(postId) {
    return await Post.findByIdAndDelete(postId);
  }
}

export default new PostRepository();
