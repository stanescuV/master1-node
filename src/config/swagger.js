import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LAN Party Manager API',
      version: '1.0.0',
      description:
        'REST API to manage games and gaming stations during a LAN party',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
}

export const swaggerSpec = swaggerJsDoc(swaggerOptions)
