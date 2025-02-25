// backend/src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const annonceRoutes = require('./routes/annonceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const avisRoutes = require('./routes/avisRoutes');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/avis', avisRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API de transport-annonces!" });
});

// Port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});