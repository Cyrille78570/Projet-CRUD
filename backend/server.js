const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const connectDB = require('./config/db');
// const dotenv = require("dotenv").config();


// connexion à la DB (V2)
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


// Midelware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/post", require("./routes/post.routes"))



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