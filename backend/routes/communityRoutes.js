const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

let posts = [];

// GET all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// CREATE post
router.post('/', protect, (req, res) => {
  const newPost = {
    id: posts.length + 1,
    author: req.user.name,
    authorId: req.user._id,
    ...req.body
  };
  posts.push(newPost);
  res.json(newPost);
});

module.exports = router;
