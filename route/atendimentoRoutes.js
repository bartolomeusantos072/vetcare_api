const express = require('express');
const router = express.Router();
const atendimentoController = require('../controller/atendimentoController');
const { cacheAtendimentoId } = require('../middleware/cacheMiddleware');
const { autenticado } = require('../middleware/authMiddleware');
const { apenasRecepcao, apenasVeterinario } = require('../middleware/perfilMiddleware');

// Cadastro de atendimento (Exclusivo: Recepção)
router.post('/', autenticado, apenasRecepcao, atendimentoController.cadastrarAtendimento);

// Consulta por ID com cache de 1 dia (Exclusivo: Recepção)
router.get('/:id', autenticado, apenasRecepcao, cacheAtendimentoId, atendimentoController.consultarAtendimentoPorId);

// Rotas operacionais específicas fora do CRUD padrão (Exclusivo: Veterinário)
router.post('/:id/iniciar', autenticado, apenasVeterinario, atendimentoController.iniciarAtendimento);
router.post('/:id/finalizar', autenticado, apenasVeterinario, atendimentoController.finalizarAtendimento);

module.exports = router;