import { Router } from 'express'

import * as registrationController from '../controllers/registrationController.js'
import {
  registrationSchema,
  registrationStatusSchema
} from '../models/registrationSchema.js'

import { authenticate } from '../middlewares/authenticate.js'
import { validate } from '../middlewares/validate.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - id
 *         - tournamentId
 *         - status
 *         - registeredAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         tournamentId:
 *           type: integer
 *           example: 3
 *         playerId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         teamId:
 *           type: integer
 *           nullable: true
 *           example: null
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, REJECTED, WITHDRAWN]
 *           example: PENDING
 *         registeredAt:
 *           type: string
 *           format: date-time
 *           example: 2025-01-10T14:30:00.000Z
 *         confirmedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *
 *     RegistrationInput:
 *       type: object
 *       properties:
 *         playerId:
 *           type: integer
 *           example: 5
 *         teamId:
 *           type: integer
 *           example: 2
 *
 *     RegistrationStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, REJECTED, WITHDRAWN]
 *           example: CONFIRMED
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: Registration not found
 */

const router = Router()

/**
 * @swagger
 * /api/tournaments/{tournamentId}/register:
 *   post:
 *     summary: Register to a tournament
 *     description: Register a player or a team to an OPEN tournament
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationInput'
 *     responses:
 *       201:
 *         description: Registration created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Invalid registration data
 *       401:
 *         description: Not authenticated
 *       409:
 *         description: Registration conflict
 */
router.post(
  '/:tournamentId/register',
  authenticate,
  validate(registrationSchema),
  registrationController.create
)

/**
 * @swagger
 * /api/tournaments/{tournamentId}/registrations:
 *   get:
 *     summary: List tournament registrations
 *     description: Retrieve all registrations for a specific tournament
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: List of registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registration'
 *       401:
 *         description: Not authenticated
 */
router.get(
  '/:tournamentId/registrations',
  authenticate,
  registrationController.getAll
)

/**
 * @swagger
 * /api/tournaments/{tournamentId}/registrations/{id}:
 *   patch:
 *     summary: Update registration status
 *     description: Update the status of a registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Registration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationStatusInput'
 *     responses:
 *       200:
 *         description: Registration updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Invalid status update
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Registration not found
 */
router.patch(
  '/:tournamentId/registrations/:id',
  authenticate,
  validate(registrationStatusSchema),
  registrationController.update
)

/**
 * @swagger
 * /api/tournaments/{tournamentId}/registrations/{id}:
 *   delete:
 *     summary: Cancel a registration
 *     description: Cancel a registration if it is still pending
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Registration ID
 *     responses:
 *       204:
 *         description: Registration cancelled
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Registration not found
 *       409:
 *         description: Cannot cancel confirmed registration
 */
router.delete(
  '/:tournamentId/registrations/:id',
  authenticate,
  registrationController.remove
)

export default router
