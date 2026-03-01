const Post = require('../models/Post');

// GET /api/posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/posts
const createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const post = await Post.create({
            title, body,
            author: req.user.name,
            authorId: req.user._id,
        });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/posts/:id/reply
const addReply = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        post.replies.push({ author: req.user.name, body: req.body.body });
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        // Allow author or admin to delete
        if (String(post.authorId) !== String(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getPosts, createPost, addReply, deletePost };
