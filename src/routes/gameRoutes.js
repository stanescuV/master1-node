import express from 'express'
import * as gameController from '../controllers/gameController.js'
import { gameSchema } from '../schemas/gameSchema.js'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/authenticate.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - genre
 *         - minPlayers
 *         - maxPlayers
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique game ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Game name
 *           example: Counter-Strike 2
 *         genre:
 *           type: string
 *           description: Game genre
 *           example: FPS
 *         releaseYear:
 *           type: integer
 *           description: Release year
 *           example: 2023
 *         minPlayers:
 *           type: integer
 *           description: Minimum number of players
 *           example: 2
 *         maxPlayers:
 *           type: integer
 *           description: Maximum number of players
 *           example: 10
 *         description:
 *           type: string
 *           description: Game description
 *           example: Tactical FPS reference game
 *     GameInput:
 *       type: object
 *       required:
 *         - name
 *         - genre
 *         - minPlayers
 *         - maxPlayers
 *       properties:
 *         name:
 *           type: string
 *           description: Game name
 *           example: Counter-Strike 2
 *         genre:
 *           type: string
 *           description: Game genre
 *           example: FPS
 *         releaseYear:
 *           type: integer
 *           description: Release year
 *           example: 2023
 *         minPlayers:
 *           type: integer
 *           description: Minimum number of players
 *           example: 2
 *         maxPlayers:
 *           type: integer
 *           description: Maximum number of players
 *           example: 10
 *         description:
 *           type: string
 *           description: Game description
 *           example: Tactical FPS reference game
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Error message
 *           example: Game not found
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 */

const router = express.Router()

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: List all games
 *     description: Retrieve all games with optional filters and pagination
 *     tags: [Games]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter games by genre (e.g., FPS, MOBA)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of games to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of games to skip
 *     responses:
 *       200:
 *         description: List of games
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
 *                       description: Total number of games
 *                       example: 4
 *                     count:
 *                       type: integer
 *                       description: Number of games returned
 *                       example: 4
 *                     games:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Game'
 */
router.get('/', gameController.getAll)

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Get game by ID
 *     description: Retrieve a specific game by its ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID
 *     responses:
 *       200:
 *         description: Game found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', gameController.getById)

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Create a new game
 *     description: Add a new game to the collection
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       201:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Game'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticate, validate(gameSchema), gameController.create)

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Update a game
 *     description: Replace a game completely (all fields required)
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: Game updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Game'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticate, validate(gameSchema), gameController.update)

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Delete a game
 *     description: Remove a game from the collection
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID
 *     responses:
 *       204:
 *         description: Game deleted successfully
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, gameController.remove)

export default router
