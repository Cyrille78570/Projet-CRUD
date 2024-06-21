const PostModel = require('../models/post.model');

// Récupérer tous les posts
module.exports.getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }); 
        res.render('index', { name: req.user.name, posts: posts }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fonction pour créer un nouveau post
module.exports.createPost = async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        const newPost = await PostModel.create({
            message,
            author: req.user.name, // Utilisation du nom de l'utilisateur connecté comme auteur
            imageUrl
        });
        res.redirect('/'); // Redirection vers la page d'accueil après création du post
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit an existing post
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

// Fonction pour supprimer un post
module.exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }

        // Vérifiez si l'utilisateur connecté est l'auteur du post
        if (post.author !== req.user.name) {
            return res.status(403).json({ error: 'Accès refusé. Vous n\'êtes pas l\'auteur de ce post.' });
        }

        await post.remove();
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Like a post
module.exports.likePost = async (req, res) => {
    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { likers: req.body.userId } },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Dislike a post
module.exports.dislikePost = async (req, res) => {
    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { likers: req.body.userId } },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
