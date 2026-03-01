const express = require('express');
const router = express.Router();

let posts = [];

// GET all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// CREATE post (no auth for now)
router.post('/', (req, res) => {
  const newPost = {
    id: posts.length + 1,
    ...req.body
  };
  posts.push(newPost);
  res.json(newPost);
});

module.exports = router;
