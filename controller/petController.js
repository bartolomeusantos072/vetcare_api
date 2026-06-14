const Pet = require('../model/pet');

// Função auxiliar para montar a mensagem gramatical dinâmica
const validarCampos = (campos) => {
  const faltantes = campos
    .filter(c => !c.valor || (typeof c.valor === 'string' && c.valor.trim() === ''))
    .map(c => c.nome);

  if (faltantes.length === 0) return null;

  if (faltantes.length === 1) {
    return `O campo ${faltantes[0]} é obrigatório.`;
  }
  
  const ultimosCampos = faltantes.slice(0, -1).join(", ");
  const ultimoCampo = faltantes[faltantes.length - 1];
  return `Os campos ${ultimosCampos} e ${ultimoCampo} são obrigatórios.`;
};

// 1. Cadastro de novos Pets
const cadastrarPet = async (req, res) => {
  try {
    const { nome, especie } = req.body;

    // Executa a validação dinâmica e acumulativa criada por você
    const erroMensagem = validarCampos([
      { valor: nome, nome: "Nome" },
      { valor: especie, nome: "Espécie" }
    ]);

    if (erroMensagem) {
      return res.status(400).json({
        errors: [{ msg: erroMensagem }]
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
    const { especie } = req.query; // Captura a query string ?especie=[nome da especie]
    let pets;

    if (especie) {
      // Se informou a espécie, filtra na busca do Sequelize exatamente como exige a prova
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