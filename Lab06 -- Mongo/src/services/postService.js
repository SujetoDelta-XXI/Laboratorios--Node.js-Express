import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

class PostService {
  async createPost(userId, postData) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    return await postRepository.create({ ...postData, user: user._id });
  }

  async getPosts() {
    return await postRepository.findAll();
  }

  async getPostById(postId) {
    return await postRepository.findById(postId); // ✅ ahora existe
  }

  async updatePost(postId, postData) {
    return await postRepository.update(postId, postData);
  }

  async deletePost(postId) {
    return await postRepository.delete(postId);
  }
}

export default new PostService();
