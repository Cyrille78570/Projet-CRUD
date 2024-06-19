// const mongoose = require('mongoose')
// const express = require('express');
// const app = express();
// const port = 3000;

// const connectDB = () => {
//     mongoose.connect("mongodb+srv://cremondndpoissy:Y5Ck5Q2DIYwvdKtO@projet3.fs2intx.mongodb.net/?retryWrites=true&w=majority&appName=Projet3", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => {
//         console.log("Connecté à la database");
//         app.listen(port, () => {
//             console.log('Le serveur a démarré sur le port ' + port);
//         });
//     })
//     .catch((error) => {
//         console.error("Connexion échouée", error); 
//     });
// };

// module.exports = connectDB;