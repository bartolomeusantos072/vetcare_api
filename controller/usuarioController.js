const Usuario = require('../model/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Cadastro de Usuário
const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, usuario, senha, perfil } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !usuario || !senha) {
      return res.status(400).json({
        errors: [{ msg: "Nome, usuário e senha são obrigatórios." }]
      });
    }

    // Validação do tamanho da senha (mínimo 6 caracteres) [cite: 96]
    if (senha.length < 6) {
      return res.status(400).json({
        errors: [{ msg: "A senha deve ter, pelo menos, 6 caracteres." }]
      });
    }

    // Validação de campo único: Verifica se o usuário já existe [cite: 139, 218]
    const usuarioExistente = await Usuario.findOne({ where: { usuario } });
    if (usuarioExistente) {
      return res.status(400).json({
        errors: [{ msg: "Já existe um usuário cadastrado com este identificador" }]
      });
    }

    // Criptografa a senha antes de salvar no banco [cite: 17]
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // Cria o usuário no banco (se perfil não for enviado, assume o padrão 'recepcao' definido no Model) [cite: 18, 97]
    const novoUsuario = await Usuario.create({
      nome,
      usuario,
      senha_hash,
      perfil: perfil || 'recepcao'
    });

    // Retorna os dados do usuário criado ocultando o hash por segurança [cite: 187, 202]
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

    // Validação de campos obrigatórios [cite: 280, 298]
    if (!usuario || !senha) {
      return res.status(400).json({
        errors: [{ msg: "Usuario e senha são obrigatórios" }]
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

    // Monta o Payload do Token JWT conforme o padrão visto em aula [cite: 273]
    const payload = {
      id: user.id,
      perfil: user.perfil
    };

    // Assina o Token JWT com validade (ex: 1 dia) utilizando a secret do .env [cite: 119]
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_fallback', {
      expiresIn: '1d'
    });

    // Retorna o formato exato exigido na imagem do print da página 7 [cite: 267, 269, 274]
    return res.status(200).json({
      usuario: user.usuario,
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