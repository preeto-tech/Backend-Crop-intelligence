const { db } = require('../config/firebase');
const {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    increment,
    arrayUnion,
    arrayRemove,
    orderBy,
    limit: firestoreLimit,
    startAfter
} = require('firebase/firestore');
const { generateAIExpertAnswer } = require('./aiService');

// ── Helper ────────────────────────────────────────────────────────────────────
const isExpertUser = (user) => user.role === 'admin';

// ════════════════════════════════════════════════════════════════════════════
//  QUESTIONS
// ════════════════════════════════════════════════════════════════════════════

// GET /api/community
exports.getPosts = async (req, res) => {
    try {
        const { search, category, tag, cropId, sort = 'newest', page = 1, limit = 20 } = req.query;

        const postsRef = collection(db, 'posts');
        let q = query(postsRef);

        if (category) q = query(q, where('category', '==', category));
        if (tag) q = query(q, where('tags', 'array-contains', tag.toLowerCase()));
        if (cropId) q = query(q, where('cropId', '==', Number(cropId)));
        if (sort === 'unanswered') q = query(q, where('answered', '==', false));

        // Sorting
        if (sort === 'popular') {
            q = query(q, orderBy('upvotes', 'desc'), orderBy('views', 'desc'));
        } else {
            q = query(q, orderBy('createdAt', 'desc'));
        }

        // Pagination (Firestore basic offset-less pagination simulation or simple limit)
        // For true offset pagination, Firestore usually uses startAfter. 
        // Here we'll just implement limit for now as offset is tricky without the last doc.
        const pageSize = Number(limit);
        q = query(q, firestoreLimit(pageSize));

        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({
            total: posts.length, // Firestore doesn't provide total count easily without separate metadata or count()
            page: Number(page),
            posts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/community/:id
exports.getPostById = async (req, res) => {
    try {
        const postRef = doc(db, 'posts', req.params.id);

        // Increment views
        await updateDoc(postRef, {
            views: increment(1)
        });

        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        res.json({ id: postSnap.id, ...postSnap.data() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/community
exports.createPost = async (req, res) => {
    try {
        const { title, body, category, tags, cropId, cropName } = req.body;
        if (!title || !body) return res.status(400).json({ message: 'Title and body are required' });

        const newPost = {
            title,
            body,
            category: category || 'General',
            cropId: cropId ? Number(cropId) : null,
            cropName: cropName || '',
            tags: tags ? tags.map(t => t.toLowerCase()) : [],
            author: req.user.name,
            authorId: req.user.id,
            upvotes: 0,
            upvotedBy: [],
            views: 0,
            answers: [],
            answered: false,
            isClosed: false,
            isPinned: false,
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'posts'), newPost);

        // AI Expert Trigger
        setImmediate(async () => {
            try {
                const aiAnswerText = await generateAIExpertAnswer({ title, body, cropName, category });
                const aiAnswer = {
                    id: Date.now().toString(), // Simulation of sub-doc ID
                    body: aiAnswerText,
                    author: 'AI EXPERT',
                    authorId: null,
                    isExpert: true,
                    isAccepted: false,
                    upvotes: 0,
                    upvotedBy: [],
                    createdAt: new Date().toISOString()
                };
                await updateDoc(docRef, {
                    answers: arrayUnion(aiAnswer)
                });
            } catch (aiErr) {
                console.error(`❌ AI Expert failed: ${aiErr.message}`);
            }
        });

        res.status(201).json({ id: docRef.id, ...newPost });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/community/:id
exports.deletePost = async (req, res) => {
    try {
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        const postData = postSnap.data();
        if (postData.authorId !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ message: 'Not authorised' });

        await deleteDoc(postRef);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/community/:id/upvote
exports.upvotePost = async (req, res) => {
    try {
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        const postData = postSnap.data();
        const userId = req.user.id;
        const upvotedBy = postData.upvotedBy || [];

        if (upvotedBy.includes(userId)) {
            await updateDoc(postRef, {
                upvotes: increment(-1),
                upvotedBy: arrayRemove(userId)
            });
            res.json({ upvotes: postData.upvotes - 1, voted: false });
        } else {
            await updateDoc(postRef, {
                upvotes: increment(1),
                upvotedBy: arrayUnion(userId)
            });
            res.json({ upvotes: postData.upvotes + 1, voted: true });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ════════════════════════════════════════════════════════════════════════════
//  ANSWERS
// ════════════════════════════════════════════════════════════════════════════

// POST /api/community/:id/answers
exports.addAnswer = async (req, res) => {
    try {
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });
        if (postSnap.data().isClosed) return res.status(400).json({ message: 'Post is closed' });

        const { body } = req.body;
        const answer = {
            id: Date.now().toString(),
            body,
            author: req.user.name,
            authorId: req.user.id,
            isExpert: isExpertUser(req.user),
            isAccepted: false,
            upvotes: 0,
            upvotedBy: [],
            createdAt: new Date().toISOString()
        };

        await updateDoc(postRef, {
            answers: arrayUnion(answer)
        });

        res.status(201).json(answer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/community/:id/answers/:answerId
exports.deleteAnswer = async (req, res) => {
    try {
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        const postData = postSnap.data();
        const answer = postData.answers.find(a => a.id === req.params.answerId);
        if (!answer) return res.status(404).json({ message: 'Answer not found' });

        if (answer.authorId !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ message: 'Not authorised' });

        await updateDoc(postRef, {
            answers: arrayRemove(answer)
        });
        res.json({ message: 'Answer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/community/:id/answers/:answerId/accept
exports.acceptAnswer = async (req, res) => {
    try {
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        const postData = postSnap.data();
        if (postData.authorId !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ message: 'Only author can accept' });

        const updatedAnswers = postData.answers.map(a => ({
            ...a,
            isAccepted: a.id === req.params.answerId
        }));

        await updateDoc(postRef, {
            answers: updatedAnswers,
            answered: true
        });

        res.json({ message: 'Answer accepted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/community/:id/answers/:answerId/upvote
exports.upvoteAnswer = async (req, res) => {
    try {
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        const postData = postSnap.data();
        const userId = req.user.id;

        const updatedAnswers = postData.answers.map(a => {
            if (a.id === req.params.answerId) {
                const upvotedBy = a.upvotedBy || [];
                if (upvotedBy.includes(userId)) {
                    return { ...a, upvotes: a.upvotes - 1, upvotedBy: upvotedBy.filter(id => id !== userId) };
                } else {
                    return { ...a, upvotes: a.upvotes + 1, upvotedBy: [...upvotedBy, userId] };
                }
            }
            return a;
        });

        await updateDoc(postRef, { answers: updatedAnswers });
        res.json({ message: 'Vote toggled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/community/:id/pin
exports.pinPost = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        await updateDoc(postRef, { isPinned: !postSnap.data().isPinned });
        res.json({ message: 'Pin toggled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/community/:id/close
exports.closePost = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
        const postRef = doc(db, 'posts', req.params.id);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return res.status(404).json({ message: 'Post not found' });

        await updateDoc(postRef, { isClosed: !postSnap.data().isClosed });
        res.json({ message: 'Closed toggled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

