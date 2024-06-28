if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const postController = require('./controlles/post.controller'); 

const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

// Connexion à la DB
mongoose.connect("mongodb+srv://cremondndpoissy:Y5Ck5Q2DIYwvdKtO@projet3.fs2intx.mongodb.net/projet3", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connecté à la database");
    app.listen(port, () => {
        console.log('Le serveur a démarré sur le port ' + port);
    });
})
.catch((error) => {
    console.error("Connexion échouée", error); 
});

const User = require('./models/user.model'); 

app.set('view engine', 'ejs'); 
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Page d'accueil
app.get('/', checkAuthenticated, postController.getPosts);

// Créer un nouveau post
app.post('/post', checkAuthenticated, postController.createPost); 

// Routes d'authentification
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 9);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement :', error);
        res.redirect('/register');
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.delete('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes des posts
app.use('/post', require('./routes/post.routes'));

module.exports = app;



// Lancement du serveur (V1)

// mongoose.connect("mongodb+srv://cremondndpoissy:Y5Ck5Q2DIYwvdKtO@projet3.fs2intx.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Projet3")
// .then(() => {
//     console.log("Connecté à la database");
//     app.listen(port , () => {
//         console.log('Le serveur à démarré sur le port ' + port);
//     });
// })
// .catch(() => {
//     console.log("Connexion échoué");
// });