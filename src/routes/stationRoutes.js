import express from 'express'
import * as stationController from '../controllers/stationController.js'
import { stationSchema } from '../schemas/stationSchema.js'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/authenticate.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - cpu
 *         - gpu
 *         - ram
 *         - storage
 *         - monitor
 *         - keyboard
 *         - mouse
 *         - headset
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique station ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Station name
 *           example: Gaming Station Alpha
 *         cpu:
 *           type: string
 *           description: CPU
 *           example: Intel Core i9-13900K
 *         gpu:
 *           type: string
 *           description: Graphics card
 *           example: NVIDIA RTX 4090
 *         ram:
 *           type: string
 *           description: RAM
 *           example: 32GB DDR5
 *         storage:
 *           type: string
 *           description: Storage
 *           example: 2TB NVMe SSD
 *         monitor:
 *           type: string
 *           description: Monitor
 *           example: ASUS ROG Swift 27" 240Hz
 *         keyboard:
 *           type: string
 *           description: Keyboard
 *           example: Corsair K95 RGB Mechanical
 *         mouse:
 *           type: string
 *           description: Mouse
 *           example: Logitech G Pro X Superlight
 *         headset:
 *           type: string
 *           description: Headset
 *           example: SteelSeries Arctis Pro
 *         status:
 *           type: string
 *           enum:
 *             - available
 *             - maintenance
 *             - booked
 *           description: Station status
 *           example: available
 *     StationInput:
 *       type: object
 *       required:
 *         - name
 *         - cpu
 *         - gpu
 *         - ram
 *         - storage
 *         - monitor
 *         - keyboard
 *         - mouse
 *         - headset
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Station name
 *           example: Gaming Station Alpha
 *         cpu:
 *           type: string
 *           description: CPU
 *           example: Intel Core i9-13900K
 *         gpu:
 *           type: string
 *           description: Graphics card
 *           example: NVIDIA RTX 4090
 *         ram:
 *           type: string
 *           description: RAM
 *           example: 32GB DDR5
 *         storage:
 *           type: string
 *           description: Storage
 *           example: 2TB NVMe SSD
 *         monitor:
 *           type: string
 *           description: Monitor
 *           example: ASUS ROG Swift 27" 240Hz
 *         keyboard:
 *           type: string
 *           description: Keyboard
 *           example: Corsair K95 RGB Mechanical
 *         mouse:
 *           type: string
 *           description: Mouse
 *           example: Logitech G Pro X Superlight
 *         headset:
 *           type: string
 *           description: Headset
 *           example: SteelSeries Arctis Pro
 *         status:
 *           type: string
 *           enum:
 *             - available
 *             - maintenance
 *             - booked
 *           description: Station status
 *           example: available
 */

const router = express.Router()

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: List all stations
 *     description: Retrieve all gaming stations with optional filters and pagination
 *     tags: [Stations]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, maintenance, booked]
 *         description: Filter stations by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of stations to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of stations to skip
 *     responses:
 *       200:
 *         description: List of stations
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
 *                       description: Total number of stations
 *                       example: 5
 *                     count:
 *                       type: integer
 *                       description: Number of stations returned
 *                       example: 5
 *                     stations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Station'
 */
router.get('/', stationController.getAll)

/**
 * @swagger
 * /api/stations/{id}:
 *   get:
 *     summary: Get station by ID
 *     description: Retrieve a specific gaming station by its ID
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Station ID
 *     responses:
 *       200:
 *         description: Station found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', stationController.getById)

/**
 * @swagger
 * /api/stations:
 *   post:
 *     summary: Create a new station
 *     description: Add a new gaming station to the collection
 *     tags: [Stations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationInput'
 *     responses:
 *       201:
 *         description: Station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Station'
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
router.post(
  '/',
  authenticate,
  validate(stationSchema),
  stationController.create
)

/**
 * @swagger
 * /api/stations/{id}:
 *   put:
 *     summary: Update a station
 *     description: Replace a station completely (all fields required)
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Station ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationInput'
 *     responses:
 *       200:
 *         description: Station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Station'
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
 *         description: Station not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  authenticate,
  validate(stationSchema),
  stationController.update
)

/**
 * @swagger
 * /api/stations/{id}:
 *   delete:
 *     summary: Delete a station
 *     description: Remove a gaming station from the collection
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Station ID
 *     responses:
 *       204:
 *         description: Station deleted successfully
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Station not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, stationController.remove)

export default router
