const express = require('express');
const helmet = require('helmet');
const passport = require('passport'); // ADICIONADO: Importação do Passport
require('dotenv').config();

// Importa a conexão do banco e os modelos/relacionamentos centralizados
const { sequelize } = require('./model/index');

// IMPORTAÇÃO DAS ROTAS DOS DOMÍNIOS
const indexRoutes = require('./route/index');
const petRoutes = require('./route/petRoutes');
const usuarioRoutes = require('./route/usuarioRoutes');
const atendimentoRoutes = require('./route/atendimentoRoutes');


// IMPORTAÇÃO DO SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-output.json');

const app = express();

// ==========================================
// 1. CONFIGURAÇÕES DE SEGURANÇA (HELMET)
// ==========================================
app.use(helmet({
  hidePoweredBy: true, 
  contentSecurityPolicy: true 
}));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Parsers para ler o corpo das requisições (JSON e formulários)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ADICIONADO: Inicializa o Passport como middleware global do Express
app.use(passport.initialize());

// ==========================================
// 2. CONEXÃO E SINCRONIZAÇÃO DO BANCO DE DADOS
// ==========================================
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('--- Conexão com o banco "vetcare_api" estabelecida com sucesso! ---');
    console.log('--- Tabelas verificadas/criadas com sucesso no MySQL. ---');
  })
  .catch((error) => {
    console.error('Erro crítico ao conectar e sincronizar o banco de dados:', error);
  });

// ==========================================
// 3. VINCULAÇÃO DE ROTAS POR DOMÍNIO
// ==========================================
app.use('/', indexRoutes);          // Domínio do Index (Rota Principal)
app.use('/pets', petRoutes);        // Domínio dos Pets (Cadastro e Listagem)
app.use('/usuarios', usuarioRoutes); // Domínio dos Usuários (Cadastro e Login JWT)
app.use('/atendimentos', atendimentoRoutes);

// Rota oficial da documentação Swagger (Exigência do Módulo 4)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;