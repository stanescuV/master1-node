import swaggerJsDoc from 'swagger-jsdoc'

const getServers = () => {
  const servers = []

  // Development server
  if (process.env.NODE_ENV !== 'production') {
    servers.push({
      url: 'http://localhost:3000',
      description: 'Development server',
    })
  }

  // Production server (if configured)
  if (process.env.API_URL) {
    servers.push({
      url: process.env.API_URL,
      description: 'Production server',
    })
  }

  // Fallback to localhost if no servers configured
  if (servers.length === 0) {
    servers.push({
      url: 'http://localhost:3000',
      description: 'Local server',
    })
  }

  return servers
}

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tournoi Esport Projet Evan',
      version: '1.0.0',
      description:
        'REST API to manage an Esport Tournament App',
    },
    servers: getServers(),
  },
  apis: ['./src/routes/*.js'],
}

export const swaggerSpec = swaggerJsDoc(swaggerOptions)
