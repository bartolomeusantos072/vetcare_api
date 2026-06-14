const { Atendimento, Pet } = require('../model/index');

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

// 1. Cadastro de Atendimento (POST /atendimentos)
const cadastrarAtendimento = async (req, res) => {
  try {
    const { data_hora, motivo, pet_id } = req.body;

    // Executa a validação dinâmica acumulativa
    const erroMensagem = validarCampos([
      { valor: data_hora, nome: "Data e Hora" },
      { valor: motivo, nome: "Motivo" },
      { valor: pet_id, nome: "ID do Pet" }
    ]);

    if (erroMensagem) {
      return res.status(400).json({
        errors: [{ msg: erroMensagem }]
      });
    }

    // Cria o atendimento vinculando o ID do usuário logado extraído do token JWT
    const novoAtendimento = await Atendimento.create({
      data_hora,
      motivo,
      pet_id,
      usuario_id: req.user.id, // Extraído automaticamente do usuário autenticado pelo Passport
      status: 'agendado'       // Força o status padrão de novos cadastros
    });

    return res.status(201).json(novoAtendimento);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao cadastrar atendimento." });
  }
};

// 2. Consulta de Atendimento por ID (GET /atendimentos/:id)
const consultarAtendimentoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o atendimento trazendo junto as informações completas do Pet associado
    const atendimento = await Atendimento.findByPk(id, {
      include: [{ model: Pet }]
    });

    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    return res.status(200).json(atendimento);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao consultar atendimento." });
  }
};

// 3. Iniciar Atendimento (POST /atendimentos/:id/iniciar)
const iniciarAtendimento = async (req, res) => {
  try {
    const { id } = req.params;
    const atendimento = await Atendimento.findByPk(id);

    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    // Regra de negócio: Se o atendimento já estiver em andamento, retorna erro 400
    if (atendimento.status === 'em_atendimento') {
      return res.status(400).json({ error: "Atendimento ja está com este status" });
    }

    // Atualiza o status
    atendimento.status = 'em_atendimento';
    await atendimento.save();

    return res.status(200).json(atendimento);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao iniciar atendimento." });
  }
};

// 4. Finalizar Atendimento (POST /atendimentos/:id/finalizar)
const finalizarAtendimento = async (req, res) => {
  try {
    const { id } = req.params;
    const atendimento = await Atendimento.findByPk(id);

    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    // Regra de negócio: Se o atendimento já estiver finalizado, retorna erro 400
    if (atendimento.status === 'finalizado') {
      return res.status(400).json({ error: "Atendimento já está com este status" });
    }

    // Atualiza o status
    atendimento.status = 'finalizado';
    await atendimento.save();

    return res.status(200).json(atendimento);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao finalizar atendimento." });
  }
};

module.exports = {
  cadastrarAtendimento,
  consultarAtendimentoPorId,
  iniciarAtendimento,
  finalizarAtendimento
};