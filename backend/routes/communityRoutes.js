const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPosts, getPostById, createPost, deletePost, upvotePost,
  addAnswer, deleteAnswer, acceptAnswer, upvoteAnswer,
  pinPost, closePost,
} = require('../controllers/communityController');

// ── Questions ────────────────────────────────────────────────────────────────
router.get('/', getPosts);          // list / filter / search
router.get('/:id', getPostById);       // single question + answers
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.post('/:id/upvote', protect, upvotePost);

// ── Answers ──────────────────────────────────────────────────────────────────
router.post('/:id/answers', protect, addAnswer);
router.delete('/:id/answers/:answerId', protect, deleteAnswer);
router.patch('/:id/answers/:answerId/accept', protect, acceptAnswer);
router.post('/:id/answers/:answerId/upvote', protect, upvoteAnswer);

// ── Admin / Moderation ───────────────────────────────────────────────────────
router.patch('/:id/pin', protect, pinPost);
router.patch('/:id/close', protect, closePost);

module.exports = router;
