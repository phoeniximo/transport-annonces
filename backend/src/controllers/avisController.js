// backend/src/controllers/avisController.js
const { Avis, User, Annonce } = require('../models');

// Créer un nouvel avis
const createAvis = async (req, res) => {
    try {
        const { destinataire, annonce, note, commentaire } = req.body;

        // Vérifier si l'avis existe déjà
        const avisExistant = await Avis.findOne({
            auteur: req.user.id,
            destinataire,
            annonce
        });

        if (avisExistant) {
            return res.status(400).json({ message: 'Vous avez déjà donné votre avis pour cette annonce' });
        }

        // Créer l'avis
        const avis = await Avis.create({
            auteur: req.user.id,
            destinataire,
            annonce,
            note,
            commentaire
        });

        // Mettre à jour la note moyenne de l'utilisateur
        const destinataireUser = await User.findById(destinataire);
        const tousLesAvis = await Avis.find({ destinataire });
        
        const noteMoyenne = (destinataireUser.note * destinataireUser.nombreAvis + note) / (destinataireUser.nombreAvis + 1);
        
        await User.findByIdAndUpdate(destinataire, {
            note: noteMoyenne,
            nombreAvis: destinataireUser.nombreAvis + 1
        });

        await avis.populate('auteur', 'nom email');
        await avis.populate('destinataire', 'nom email');
        await avis.populate('annonce', 'titre');

        res.status(201).json(avis);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les avis d'un utilisateur
const getAvisUtilisateur = async (req, res) => {
    try {
        const { userId } = req.params;

        const avis = await Avis.find({ destinataire: userId })
            .populate('auteur', 'nom email')
            .populate('destinataire', 'nom email')
            .populate('annonce', 'titre')
            .sort('-createdAt');

        res.json(avis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les avis donnés par un utilisateur
const getAvisDonnes = async (req, res) => {
    try {
        const avis = await Avis.find({ auteur: req.user.id })
            .populate('auteur', 'nom email')
            .populate('destinataire', 'nom email')
            .populate('annonce', 'titre')
            .sort('-createdAt');

        res.json(avis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les avis reçus par un utilisateur
const getAvisRecus = async (req, res) => {
    try {
        const avis = await Avis.find({ destinataire: req.user.id })
            .populate('auteur', 'nom email')
            .populate('destinataire', 'nom email')
            .populate('annonce', 'titre')
            .sort('-createdAt');

        res.json(avis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAvis,
    getAvisUtilisateur,
    getAvisDonnes,
    getAvisRecus
};