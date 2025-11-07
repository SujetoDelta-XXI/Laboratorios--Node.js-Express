import postService from "../services/postService.js";

class PostController {
  async create(req, res) {
    try {
      const { userId, title, content, hashtags, imageUrl } = req.body;
      const formattedHashtags = hashtags ? hashtags.split(",").map(tag => tag.trim()) : [];
      const post = await postService.createPost(userId, {
        title,
        content,
        hashtags: formattedHashtags,
        imageUrl
      });
      res.redirect("/posts");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    const posts = await postService.getPosts();
    res.render("posts", { posts });
  }

  async editForm(req, res) {
    const post = await postService.getPostById(req.params.id);
    res.render("editPost", { post });
  }

  async update(req, res) {
    try {
      const { title, content, hashtags, imageUrl } = req.body;
      const formattedHashtags = hashtags ? hashtags.split(",").map(tag => tag.trim()) : [];
      await postService.updatePost(req.params.id, { title, content, hashtags: formattedHashtags, imageUrl });
      res.redirect("/posts");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    await postService.deletePost(req.params.id);
    res.redirect("/posts");
  }
}

export default new PostController();
