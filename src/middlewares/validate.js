/**
 * Validation middleware factory using Zod
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validate = schema => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      // API requests get JSON response
      if (
        req.originalUrl.startsWith('/api/') ||
        req.url.startsWith('/api/') ||
        req.path.startsWith('/api/')
      ) {
        return res.status(400).json({
          success: false,
          errors,
        })
      }

      // View requests - store errors in res.locals and continue
      res.locals.errors = errors
      res.locals.formData = req.body
      return next()
    }

    // Replace body with validated/transformed data
    req.body = result.data
    next()
  }
}
