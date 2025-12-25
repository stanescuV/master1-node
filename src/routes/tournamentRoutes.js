import express from 'express';
import * as tournamentController from '../controllers/tournamentController.js';
import { tournamentSchema } from '../models/tournamentSchema.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - game
 *         - format
 *         - maxParticipants
 *         - status
 *         - organizerId
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Winter Cup 2025
 *         game:
 *           type: string
 *           example: Counter-Strike 2
 *         format:
 *           type: string
 *           enum: [SOLO, TEAM]
 *           example: TEAM
 *         maxParticipants:
 *           type: integer
 *           example: 16
 *         prizePool:
 *           type: number
 *           example: 5000
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2025-02-01T18:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2025-02-03T18:00:00.000Z
 *         status:
 *           type: string
 *           enum: [DRAFT, OPEN, ONGOING, COMPLETED, CANCELLED]
 *           example: DRAFT
 *         organizerId:
 *           type: integer
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     TournamentInput:
 *       type: object
 *       required:
 *         - name
 *         - game
 *         - format
 *         - maxParticipants
 *         - startDate
 *       properties:
 *         name:
 *           type: string
 *           example: Winter Cup 2025
 *         game:
 *           type: string
 *           example: Counter-Strike 2
 *         format:
 *           type: string
 *           enum: [SOLO, TEAM]
 *           example: TEAM
 *         maxParticipants:
 *           type: integer
 *           example: 16
 *         prizePool:
 *           type: number
 *           example: 5000
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2025-02-01T18:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2025-02-03T18:00:00.000Z
 *
 *     TournamentStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [DRAFT, OPEN, ONGOING, COMPLETED, CANCELLED]
 *           example: OPEN
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: Tournament not found
 */

const router = express.Router();

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     summary: List all tournaments
 *     description: Retrieve tournaments with optional filters and pagination
 *     tags: [Tournaments]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, OPEN, ONGOING, COMPLETED, CANCELLED]
 *       - in: query
 *         name: game
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [SOLO, TEAM]
 *     responses:
 *       200:
 *         description: List of tournaments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 2
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tournament'
 */
router.get('/', tournamentController.getAll);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   get:
 *     summary: Get tournament by ID
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tournament found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Tournament'
 *       404:
 *         description: Tournament not found
 */
router.get('/:id', tournamentController.getById);

/**
 * @swagger
 * /api/tournaments:
 *   post:
 *     summary: Create a new tournament
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TournamentInput'
 *     responses:
 *       201:
 *         description: Tournament created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(tournamentSchema),
  tournamentController.create
);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   put:
 *     summary: Update a tournament
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TournamentInput'
 *     responses:
 *       200:
 *         description: Tournament updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tournament not found
 */
router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(tournamentSchema),
  tournamentController.update
);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   delete:
 *     summary: Delete a tournament
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tournament deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tournament not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  tournamentController.remove
);

/**
 * @swagger
 * /api/tournaments/{id}/status:
 *   patch:
 *     summary: Update tournament status
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TournamentStatusInput'
 *     responses:
 *       200:
 *         description: Tournament status updated
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tournament not found
 */
router.patch(
  '/:id/status',
  authenticate,
  validate(tournamentSchema),
  tournamentController.updateStatus
);

export default router;
