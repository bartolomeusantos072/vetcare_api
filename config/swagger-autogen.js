const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
  info: {
    title: 'API VetCare',
    description: 'API RESTful para gerenciamento de atendimentos veterinários desenvolvida para a avaliação prática.',
    version: '1.0.0',
    contact: {
      name: 'Bartolomeu Uender dos Santos'
    }
  },
  host: `localhost:${process.env.PORT || 3000}`,
  schemes: ['http'],
  // Configuração obrigatória para permitir autenticação via token no Swagger
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Insira o token JWT no formato: Bearer <seu_token_aqui>'
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = './config/swagger-output.json';
// Mapeia os arquivos de rotas para o gerador ler os endpoints automaticamente
const endpointsFiles = [
  './route/index.js',
  './route/petRoutes.js',
  './route/usuarioRoutes.js',
  './route/atendimentoRoutes.js'
];

// Executa a geração do JSON do Swagger
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('--- Documentação Swagger gerada com sucesso (swagger-output.json)! ---');
});