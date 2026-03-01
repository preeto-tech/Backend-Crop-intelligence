const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    author: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    replies: [replySchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
