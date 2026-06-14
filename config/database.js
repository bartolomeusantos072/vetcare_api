const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Evita poluir o terminal com logs de queries SQL
    define: {
      timestamps: true,       // Cria automaticamente 'createdAt' e 'updatedAt'
      underscored: true,      // Transforma CamelCase em snake_case (ex: criada_em, atualizada_em)
      underscoredAll: true
    }
  }
);

module.exports = sequelize;