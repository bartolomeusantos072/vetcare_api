const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

// Importa a conexão do banco e os modelos/relacionamentos centralizados
const { sequelize } = require('./model/index');

const app = express();

// ==========================================
// 1. CONFIGURAÇÕES DE SEGURANÇA (HELMET)
// ==========================================
// Atendendo rigorosamente aos critérios de segurança exigidos na prova:
app.use(helmet({
  hidePoweredBy: true, // Remove o cabeçalho X-Powered-By (Oculta o Express)
  contentSecurityPolicy: true // Mantém a política de segurança padrão exibida nos prints da prova
}));

// Adiciona manualmente as políticas específicas exigidas de MIME-Type e Referrer
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Parsers para ler o corpo das requisições (JSON e formulários)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ==========================================
// 2. CONEXÃO E SINCRONIZAÇÃO DO BANCO DE DADOS
// ==========================================
// Aqui acontece a mágica que você mencionou: o Sequelize conecta e cria as tabelas
sequelize.sync({ force: false }) // 'force: false' para não apagar os dados caso o servidor reinicie
  .then(() => {
    console.log('--- Conexão com o banco "vetcare_api" estabelecida com sucesso! ---');
    console.log('--- Tabelas verificadas/criadas com sucesso no MySQL. ---');
  })
  .catch((error) => {
    console.error('Erro crítico ao conectar e sincronizar o banco de dados:', error);
  });

// ==========================================
// 3. ROTAS BASE (Adicionaremos em breve)
// ==========================================
// Rota de teste temporária apenas para validação inicial
app.get('/teste', (req, res) => {
  res.json({ mensagem: "API VetCare funcionando e protegida!" });
});

module.exports = app;