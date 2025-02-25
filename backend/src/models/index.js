// backend/src/models/index.js
const mongoose = require('mongoose');

// Schéma Utilisateur
const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telephone: { type: String, required: true },
    type: { type: String, enum: ['particulier', 'transporteur'], required: true },
    ville: { type: String, required: true },
    dateInscription: { type: Date, default: Date.now },
    note: { type: Number, default: 0 },
    nombreAvis: { type: Number, default: 0 }
}, { timestamps: true });

// Schéma Annonce
const annonceSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    typeTransport: {
        type: String,
        enum: ['meuble', 'marchandise', 'bagage', 'palette', 'demenagement'],
        required: true
    },
    villeDepart: { type: String, required: true },
    villeArrivee: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    poids: Number,
    volume: Number,
    budget: Number,
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    statut: {
        type: String,
        enum: ['active', 'attribuee', 'terminee'],
        default: 'active'
    }
}, { timestamps: true });

// Schéma Message
const messageSchema = new mongoose.Schema({
    expediteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destinataire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    annonce: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annonce',
        required: true
    },
    contenu: {
        type: String,
        required: true
    },
    lu: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Schéma Avis
const avisSchema = new mongoose.Schema({
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destinataire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    annonce: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Annonce',
        required: true
    },
    note: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    commentaire: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500
    }
}, { timestamps: true });

// Création des modèles
const User = mongoose.model('User', userSchema);
const Annonce = mongoose.model('Annonce', annonceSchema);
const Message = mongoose.model('Message', messageSchema);
const Avis = mongoose.model('Avis', avisSchema);

// Export des modèles
module.exports = {
    User,
    Annonce,
    Message,
    Avis
};