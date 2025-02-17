// backend/src/controllers/messageController.js
const { Message } = require('../models');

const sendMessage = async (req, res) => {
    try {
        const { destinataire, annonce, contenu } = req.body;
        const message = await Message.create({
            expediteur: req.user.id,
            destinataire,
            annonce,
            contenu
        });

        await message.populate([
            { path: 'expediteur', select: 'nom email' },
            { path: 'destinataire', select: 'nom email' },
            { path: 'annonce', select: 'titre' }
        ]);
        
        res.status(201).json(message);
    } catch (error) {
        console.error('Erreur sendMessage:', error);
        res.status(400).json({ message: error.message });
    }
};

const getConversations = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { expediteur: req.user.id },
                { destinataire: req.user.id }
            ]
        })
        .sort({ createdAt: -1 })
        .populate([
            { path: 'expediteur', select: 'nom email' },
            { path: 'destinataire', select: 'nom email' },
            { path: 'annonce', select: 'titre' }
        ]);

        // Grouper les messages par conversation
        const conversations = {};
        
        messages.forEach(message => {
            const otherUser = message.expediteur._id.toString() === req.user.id ? 
                message.destinataire : message.expediteur;
            
            const conversationKey = `${message.annonce._id}-${otherUser._id}`;
            
            if (!conversations[conversationKey]) {
                conversations[conversationKey] = {
                    annonce: message.annonce,
                    otherUser,
                    messages: []
                };
            }
            
            conversations[conversationKey].messages.push(message);
        });

        res.json(Object.values(conversations));
    } catch (error) {
        console.error('Erreur getConversations:', error);
        res.status(500).json({ message: error.message });
    }
};

const getConversation = async (req, res) => {
    try {
        const { annonceId, userId } = req.params;
        
        const messages = await Message.find({
            annonce: annonceId,
            $or: [
                { expediteur: userId, destinataire: req.user.id },
                { expediteur: req.user.id, destinataire: userId }
            ]
        })
        .sort('createdAt')
        .populate([
            { path: 'expediteur', select: 'nom email' },
            { path: 'destinataire', select: 'nom email' },
            { path: 'annonce', select: 'titre' }
        ]);

        res.json(messages);
    } catch (error) {
        console.error('Erreur getConversation:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getConversations,
    getConversation
};