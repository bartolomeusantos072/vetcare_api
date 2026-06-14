const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const Usuario = require('../model/usuario');
require('dotenv').config();

// Configura as opções para extrair o token JWT dos cabeçalhos HTTP
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret_fallback'
};

// Define a estratégia de validação do token
passport.use(new Strategy(opts, async (jwt_payload, done) => {
  try {
    // Busca o usuário baseado no ID contido no payload do token
    const usuario = await Usuario.findByPk(jwt_payload.id);
    
    if (usuario) {
      return done(null, usuario);
    }
    
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Middleware que será colocado nas rotas protegidas
const autenticado = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, usuario, info) => {
    if (err) {
      return next(err);
    }
    // Caso o usuário não esteja autenticado, retorna o código HTTP 401 exigido na prova
    if (!usuario) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Injeta o usuário logado na requisição para uso posterior
    req.user = usuario;
    next();
  })(req, res, next);
};

module.exports = {
  autenticado
};