const express = require('express');
const router = express.Router();
const petController = require('../controller/petController');
const { cachePets } = require('../middleware/cacheMiddleware');

// IMPORTAÇÃO DOS MIDDLEWARES DE PROTEÇÃO
const { autenticado } = require('../middleware/authMiddleware');
const { apenasAdmin, apenasRecepcao } = require('../middleware/perfilMiddleware');

// Rota para cadastrar Pet (POST /pets) -> Protegida para Admin
router.post('/', autenticado, apenasAdmin, petController.cadastrarPet);

// Rota para listar Pets (GET /pets) -> Protegida para Recepção
router.get('/', autenticado, apenasRecepcao, cachePets, petController.listarPets);

module.exports = router;