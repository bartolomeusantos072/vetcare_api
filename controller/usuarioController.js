const Usuario = require('../model/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Função auxiliar para montar a mensagem gramatical dinâmica
const validarCampos = (campos) => {
  // Filtra apenas os nomes dos campos que vieram vazios ou nulos
  const faltantes = campos
    .filter(c => !c.valor || (typeof c.valor === 'string' && c.valor.trim() === ''))
    .map(c => c.nome);

  if (faltantes.length === 0) return null;

  if (faltantes.length === 1) {
    return `O campo ${faltantes[0]} é obrigatório.`;
  }
  
  // Se faltarem 2 ou mais, junta com vírgulas e coloca o "e" no último elemento
  const ultimosCampos = faltantes.slice(0, -1).join(", ");
  const ultimoCampo = faltantes[faltantes.length - 1];
  return `Os campos ${ultimosCampos} e ${ultimoCampo} são obrigatórios.`;
};

// 1. Cadastro de Usuário
const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, usuario, senha, perfil } = req.body;

    // Executa a validação dinâmica e acumulativa
    const erroMensagem = validarCampos([
      { valor: nome, nome: "Nome" },
      { valor: usuario, nome: "Usuário" },
      { valor: senha, nome: "Senha" }
    ]);

    if (erroMensagem) {
      return res.status(400).json({
        errors: [{ msg: erroMensagem }]
      });
    }

    // Validação do tamanho da senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      return res.status(400).json({
        errors: [{ msg: "A senha deve ter, pelo menos, 6 caracteres." }]
      });
    }

    // Validação de campo único: Verifica se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ where: { usuario } });
    if (usuarioExistente) {
      return res.status(400).json({
        errors: [{ msg: "Já existe um usuário cadastrado com este identificador" }]
      });
    }

    // Criptografa a senha antes de salvar no banco
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // Cria o usuário no banco
    const novoUsuario = await Usuario.create({
      nome,
      usuario,
      senha_hash,
      perfil: perfil || 'recepcao'
    });

    // Retorna os dados do usuário criado ocultando o hash por segurança
    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      usuario: novoUsuario.usuario,
      perfil: novoUsuario.perfil
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
  }
};

// 2. Login de Usuário
const login = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Executa a mesma validação dinâmica para o login
    const erroMensagem = validarCampos([
      { valor: usuario, nome: "Usuário" },
      { valor: senha, nome: "Senha" }
    ]);

    if (erroMensagem) {
      return res.status(400).json({
        errors: [{ msg: erroMensagem }]
      });
    }

    // Busca o usuário na base de dados
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.status(401).json({
        errors: [{ msg: "Credenciais inválidas" }]
      });
    }

    // Compara a senha enviada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({
        errors: [{ msg: "Credenciais inválidas" }]
      });
    }

    // Monta o Payload do Token JWT
    const payload = {
      id: user.id,
      perfil: user.perfil
    };

    // Assina o Token JWT com validade de 1 dia
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_fallback', {
      expiresIn: '1d'
    });

    // Retorna o formato exato exigido na imagem do print da página 7
    return res.status(200).json({
      token: token,
      usuario: {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario,
        perfil: user.perfil
      }
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao processar o login." });
  }
};

module.exports = {
  cadastrarUsuario,
  login
};