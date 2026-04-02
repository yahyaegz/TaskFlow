const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'Enterprise-grade Task Management API Documentation',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'TaskFlow Support',
        url: 'https://taskflow.com',
        email: 'support@taskflow.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.js', './src/modules/**/*.controller.js'], // files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
