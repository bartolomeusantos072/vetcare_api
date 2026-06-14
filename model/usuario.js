const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Garante que o usuário seja único na base
  },
  senha_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  perfil: {
    type: DataTypes.ENUM('recepcao', 'admin', 'veterinario'),
    allowNull: false,
    defaultValue: 'recepcao' // Opção padrão para novos cadastros
  }
}, {
  tableName: 'usuarios',
  timestamps: true // Cria automaticamente criado_em e atualizada_em (snake_case via database.js)
});

module.exports = Usuario;