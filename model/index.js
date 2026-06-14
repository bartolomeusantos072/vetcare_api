const sequelize = require('../config/database');
const Usuario = require('./usuario');
const Pet = require('./pet');
const Atendimento = require('./atendimento');

// Relacionamento Usuario (1) : (N) Atendimento
Usuario.hasMany(Atendimento, { foreignKey: { name: 'usuario_id', allowNull: false } });
Atendimento.belongsTo(Usuario, { foreignKey: { name: 'usuario_id', allowNull: false } });

// Relacionamento Pet (1) : (N) Atendimento
Pet.hasMany(Atendimento, { foreignKey: { name: 'pet_id', allowNull: false } });
Atendimento.belongsTo(Pet, { foreignKey: { name: 'pet_id', allowNull: false } });

module.exports = {
  sequelize,
  Usuario,
  Pet,
  Atendimento
};