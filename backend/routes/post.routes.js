const express = require('express');
const router = express.Router();
const postController = require('../controlles/post.controller'); 

const PostModel = require('../models/post.model');

// Middleware
const isAuthorOrAdmin = async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }

        if (req.user._id !== "66754a66e0bba87ca931b2eb" && post.author !== req.user.name) {
            return res.status(403).json({ error: 'Accès refusé. Vous n\'êtes pas autorisé à effectuer cette action.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Routes
router.post('/', postController.createPost);
router.delete('/:id', isAuthorOrAdmin, postController.deletePost);
router.put('/edit/:id', isAuthorOrAdmin, postController.editPost); 
router.patch('/like-post/:id', postController.likePost);
router.patch('/dislike-post/:id', postController.dislikePost);

module.exports = router;
