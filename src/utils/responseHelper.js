
/**
 * Success response (200 OK)
 * @param {any} data - Data to return
 * @returns {{ success: true, data: any }}
 */

// Suggestion, mettre res comme parametre pour gérer le status code directement ici. Eviter le res.status(201).json(...) dans les controllers
// avoir juste response.created(res, team) / response.success(res, team) / response.error(res, 'message', 400) 
export const success = data => ({
  success: true,
  data,
})

/**
 * Creation response (201 Created)
 * @param {any} data - Created entity
 * @returns {{ success: true, data: any }}
 */
export const created = data => ({
  success: true,
  data,
})

/**
 * Error response
 * @param {string} message - Error message
 * @param {number} _status - HTTP code (default 500)
 * @returns {{ success: false, error: string }}
 */
export const error = (message, _status = 500) => ({
  success: false,
  error: message,
})
