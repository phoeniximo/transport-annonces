// backend/src/routes/annonceRoutes.js
const express = require('express');
const router = express.Router();
const annonceController = require('../controllers/annonceController');
const auth = require('../middleware/auth');

// Routes publiques
router.get('/', annonceController.getAnnonces);
router.get('/:id', annonceController.getAnnonceById);

// Routes protégées (nécessitent une authentification)
router.post('/', auth, annonceController.createAnnonce);
router.put('/:id', auth, annonceController.updateAnnonce);
router.delete('/:id', auth, annonceController.deleteAnnonce);
router.get('/user/mes-annonces', auth, annonceController.getMesAnnonces);

module.exports = router;