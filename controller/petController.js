const Pet = require('../model/pet');

// 1. Cadastro de novos Pets
const cadastrarPet = async (req, res) => {
  try {
    const { nome, especie } = req.body;

    // Validação de dados básica de formulário (campos obrigatórios)
    if (!nome || !especie) {
      return res.status(400).json({ 
        errors: [{ msg: "Nome e espécie são obrigatórios." }] 
      });
    }

    // Cria o registro no banco utilizando o Sequelize
    const novoPet = await Pet.create({ nome, especie });

    // Código HTTP 201 para recurso criado com sucesso
    return res.status(201).json(novoPet);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao cadastrar o pet." });
  }
};

// 2. Listagem de Pets com suporte a Query String
const listarPets = async (req, res) => {
  try {
    const { especie } = req.query; // Captura a query string ?especie=...
    let pets;

    if (especie) {
      // Se informou a espécie, filtra na busca do Sequelize
      pets = await Pet.findAll({
        where: { especie: especie }
      });
    } else {
      // Caso contrário, traz todos os pets cadastrados
      pets = await Pet.findAll();
    }

    return res.status(200).json(pets);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao listar os pets." });
  }
};

module.exports = {
  cadastrarPet,
  listarPets
};