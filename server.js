// server.js
const app = require('./app');
const { sequelize } = require('./model'); // Puxa seus modelos e a conexão
require('dotenv').config();

const PORT = process.env.PORT || 3000;

console.log('--- Iniciando o Servidor VetCare API ---');

// Sincroniza o banco de dados antes de abrir a porta do servidor
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('--- Conexão com o banco "vetcare_api" estabelecida com sucesso! ---');
    console.log('--- Tabelas verificadas/criadas com sucesso no MySQL. ---');
    
    // Abre a porta para receber requisições
    app.listen(PORT, () => {
      console.log(`--- Servidor rodando com sucesso na porta ${PORT} ---`);
      console.log(`--- Documentação disponível em: http://localhost:${PORT}/api-docs ---`);
    });
  })
  .catch((error) => {
    console.error('Erro crítico ao conectar e sincronizar o banco de dados:', error);
  });