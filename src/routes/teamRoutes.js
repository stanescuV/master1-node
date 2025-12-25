import express from 'express'
import * as teamController from '../controllers/teamController.js'
import { teamSchema } from '../models/teamSchema.js'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/authenticate.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Team Alpha
 *         tag:
 *           type: string
 *           example: ALPHA
 */

const router = express.Router()

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: List all teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of teams
 */
router.get('/', teamController.getAll)

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team found
 *       404:
 *         description: Team not found
 */
router.get('/:id', teamController.getById)

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, validate(teamSchema), teamController.create)

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, validate(teamSchema), teamController.update)

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, teamController.remove)

export default router
