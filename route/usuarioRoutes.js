const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');

// Rota para Cadastro de Usuário (POST /usuarios)
router.post('/', usuarioController.cadastrarUsuario);

// Rota para Login de Usuário (POST /usuarios/login)
router.post('/login', usuarioController.login);

module.exports = router;