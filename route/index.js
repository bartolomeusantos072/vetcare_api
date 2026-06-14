const express = require('express');
const router = express.Router();
const { semCache } = require('../middleware/cacheMiddleware');
require('dotenv').config();

// Rota Principal configurada diretamente no arquivo de rotas (Padrão do Professor)
router.get('/', semCache, (req, res) => {
  try {
    // Gerando o timestamp dinâmico no formato exigido pelo print da prova
    const timestampAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return res.status(200).json({
      nome: "API VetCare",
      descricao: "API RESTful para gerenciamento de atendimentos veterinários",
      versao: "1.0",
      tecnologias: [
        "Node.js",
        "Express",
        "Sequelize",
        "JWT",
        "Swagger"
      ],
      status: "online",
      timestamp: timestampAtual,
      documentacao: `http://localhost:${process.env.PORT || 3000}/api-docs`
    });
  } catch (error) {
    // Configuração de código de resposta HTTP adequada para erro interno
    return res.status(500).json({ error: "Erro interno ao processar requisição." });
  }
});

module.exports = router;