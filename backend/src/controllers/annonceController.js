// backend/src/controllers/annonceController.js
const { Annonce } = require('../models');

// Créer une nouvelle annonce
const createAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.create({
            ...req.body,
            auteur: req.user.id
        });
        res.status(201).json(annonce);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer toutes les annonces avec filtres
const getAnnonces = async (req, res) => {
    try {
        const { typeTransport, villeDepart, villeArrivee, dateDepart, statut } = req.query;
        const filter = {};

        if (typeTransport) filter.typeTransport = typeTransport;
        if (villeDepart) filter.villeDepart = new RegExp(villeDepart, 'i');
        if (villeArrivee) filter.villeArrivee = new RegExp(villeArrivee, 'i');
        if (dateDepart) filter.dateDepart = { $gte: new Date(dateDepart) };
        if (statut) filter.statut = statut;

        const annonces = await Annonce.find(filter)
            .populate('auteur', 'nom email telephone ville note')
            .sort({ createdAt: -1 });

        res.json(annonces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une annonce par ID
const getAnnonceById = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id)
            .populate('auteur', 'nom email telephone ville note');
        
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        
        res.json(annonce);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une annonce
const updateAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id);
        
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Vérifier que l'utilisateur est l'auteur de l'annonce
        if (annonce.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        const updatedAnnonce = await Annonce.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedAnnonce);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une annonce
const deleteAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id);
        
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Vérifier que l'utilisateur est l'auteur de l'annonce
        if (annonce.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        await annonce.deleteOne();
        res.json({ message: 'Annonce supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les annonces d'un utilisateur
const getMesAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.find({ auteur: req.user.id })
            .sort({ createdAt: -1 });
        res.json(annonces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAnnonce,
    getAnnonces,
    getAnnonceById,
    updateAnnonce,
    deleteAnnonce,
    getMesAnnonces
};