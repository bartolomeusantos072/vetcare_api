// Middleware para permitir apenas usuários com perfil 'admin'
const apenasAdmin = (req, res, next) => {
  if (req.user && req.user.perfil === 'admin') {
    return next();
  }
  // Retorna o formato exato de erro 403 do print da página 7 da prova
  return res.status(403).json({ error: "Acesso negado apenas Recepção." });
};

// Middleware para permitir apenas usuários com perfil 'recepcao'
const apenasRecepcao = (req, res, next) => {
  if (req.user && req.user.perfil === 'recepcao') {
    return next();
  }
  // Retorna o formato exato de erro 403 do print da página 9 da prova
  return res.status(403).json({ error: "Acesso negado: apenas Recepção." });
};

// Middleware para permitir apenas usuários com perfil 'veterinario'
const apenasVeterinario = (req, res, next) => {
  if (req.user && req.user.perfil === 'veterinario') {
    return next();
  }
  // Retorna o formato exato de erro 403 do print da página 10 da prova
  return res.status(403).json({ error: "Acesso negado: apenas Veterinários." });
};

module.exports = {
  apenasAdmin,
  apenasRecepcao,
  apenasVeterinario
};