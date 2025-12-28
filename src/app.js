import express from 'express'
import session from 'express-session'
import swaggerUi from 'swagger-ui-express'

import { env } from './config/env.js'
import apiRoutes from './routes/index.js'
import { swaggerSpec } from './config/swagger.js'
import { logger } from './middlewares/logger.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

// Logging middleware (must be first) - disabled in test mode
if (env.NODE_ENV !== 'test') {
  app.use(logger)
}

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware
app.use(
  session({
    secret: env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null
  next()
})

// API routes
app.use('/api', apiRoutes)

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 404 handler (after all routes)
app.use(notFound)

// Error handler (must be last)
app.use(errorHandler)

export default app
