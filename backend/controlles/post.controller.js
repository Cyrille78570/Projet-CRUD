const PostModel = require('../models/post.model');

// Récupérer tous les posts
module.exports.getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 });
        res.render('index', { name: req.user.name, userId: req.user._id, posts: posts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un nouveau post
module.exports.createPost = async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        const newPost = await PostModel.create({
            message,
            author: req.user.name, 
            imageUrl
        });
        res.redirect('/'); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Editer un post
module.exports.editPost = async (req, res) => {
    const { message, author, imageUrl } = req.body;
    console.log('Je rentre dans le game')

    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Ce post n'existe pas" });
        }

        console.log('héhéhé')
        
        post.message = message || post.message;
        post.author = author || post.author;
        post.imageUrl = imageUrl || post.imageUrl;
        const updatedPost = await post.save();

        res.redirect('/');
    } catch (err) {
        console.log('Error local : ', err)
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un post
module.exports.deletePost = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }

        if (post.author.toString() === req.user.name.toString() || req.user._id.toString() === '66754a66e0bba87ca931b2eb') {
            await post.remove();
            return res.redirect('/');
        } else {
            return res.status(403).json({ error: 'Accès refusé. Vous n\'êtes pas l\'auteur de ce post.' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du post :', error);
        return res.status(500).json({ error: error.message });
    }
};

// Aimer un post
module.exports.likePost = async (req, res) => {
    console.log('Je suis là')
    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { likers: req.body.userId }, $pull: { dislikers: req.body.userId } },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ne pas aimer un post
module.exports.dislikePost = async (req, res) => {
    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { dislikers: req.body.userId }, $pull: { likers: req.body.userId } },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
