const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Atendimento = sequelize.define('Atendimento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('agendado', 'em_atendimento', 'finalizado', 'cancelado'),
    allowNull: false,
    defaultValue: 'agendado' // Opção padrão para novos cadastros
  }
}, {
  tableName: 'atendimentos',
  timestamps: true
});

module.exports = Atendimento;