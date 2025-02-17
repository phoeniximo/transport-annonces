// backend/src/controllers/avisController.js
const { Avis, User } = require('../models');

const createAvis = async (req, res) => {
    try {
        const { destinataire, annonce, note, commentaire } = req.body;

        // Vérifier si l'avis existe déjà
        const existingAvis = await Avis.findOne({
            auteur: req.user.id,
            destinataire,
            annonce
        });

        if (existingAvis) {
            return res.status(400).json({ 
                message: 'Vous avez déjà donné votre avis pour cette annonce' 
            });
        }

        // Créer le nouvel avis
        const avis = await Avis.create({
            auteur: req.user.id,
            destinataire,
            annonce,
            note,
            commentaire
        });

        // Mettre à jour la note moyenne de l'utilisateur
        const userToUpdate = await User.findById(destinataire);
        if (userToUpdate) {
            const allAvis = await Avis.find({ destinataire });
            const totalAvis = allAvis.length;
            const sommeNotes = allAvis.reduce((sum, avis) => sum + avis.note, 0);
            const nouvelleMoyenne = sommeNotes / totalAvis;

            await User.findByIdAndUpdate(destinataire, {
                note: nouvelleMoyenne,
                nombreAvis: totalAvis
            });
        }

        // Populate l'avis avec les informations nécessaires
        await avis.populate([
            { path: 'auteur', select: 'nom email' },
            { path: 'destinataire', select: 'nom email' },
            { path: 'annonce', select: 'titre' }
        ]);

        res.status(201).json(avis);
    } catch (error) {
        console.error('Erreur createAvis:', error);
        res.status(400).json({ message: error.message });
    }
};

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
        console.error('Erreur getAvisUtilisateur:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAvisDonnes = async (req, res) => {
    try {
        const avis = await Avis.find({ auteur: req.user.id })
            .populate('auteur', 'nom email')
            .populate('destinataire', 'nom email')
            .populate('annonce', 'titre')
            .sort('-createdAt');

        res.json(avis);
    } catch (error) {
        console.error('Erreur getAvisDonnes:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAvisRecus = async (req, res) => {
    try {
        const avis = await Avis.find({ destinataire: req.user.id })
            .populate('auteur', 'nom email')
            .populate('destinataire', 'nom email')
            .populate('annonce', 'titre')
            .sort('-createdAt');

        res.json(avis);
    } catch (error) {
        console.error('Erreur getAvisRecus:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAvis,
    getAvisUtilisateur,
    getAvisDonnes,
    getAvisRecus
};