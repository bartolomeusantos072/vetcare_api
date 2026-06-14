// Middleware para desabilitar completamente o cache HTTP (Rota Principal)
const semCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// ADICIONADO: Configuração de cache para a Listagem de Pets (6 meses)
const cachePets = (req, res, next) => {
  // 6 meses em segundos = 6 * 30 * 24 * 60 * 60 = 15552000 segundos
  res.setHeader('Cache-Control', 'public, max-age=15552000, must-revalidate');
  next();
};
const cacheAtendimentoId = (req, res, next) => {
  // 1 dia em segundos = 24 * 60 * 60 = 86400 segundos
  res.setHeader('Cache-Control', 'private, max-age=86400, must-revalidate');
  next();
};

module.exports = {
  semCache,
  cachePets,
  cacheAtendimentoId
};