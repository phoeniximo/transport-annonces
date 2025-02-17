// backend/src/index.js
console.log('Démarrage...');

try {
    const express = require('express');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const connectDB = require('./config/database');
    const authRoutes = require('./routes/authRoutes');
    const annonceRoutes = require('./routes/annonceRoutes');
    const messageRoutes = require('./routes/messageRoutes');
    const avisRoutes = require('./routes/avisRoutes');
    console.log('Modules importés');

    // Charger les variables d'environnement
    dotenv.config();
    console.log('Variables d\'environnement chargées');

    // Connexion à la base de données
    connectDB();

    const app = express();
    console.log('App créée');

    // Middleware
    app.use(cors());
    app.use(express.json());
    console.log('Middleware configuré');

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/annonces', annonceRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/avis', avisRoutes);
    console.log('Routes configurées');

    // Route de test
    app.get('/', (req, res) => {
        res.json({ message: "Test" });
    });

    // Port
    const PORT = process.env.PORT || 5000;

    // Démarrer le serveur
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
} catch (error) {
    console.error('Erreur:', error);
    console.error('Stack:', error.stack);
}