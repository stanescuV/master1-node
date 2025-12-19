import express from 'express'
import * as bookingController from '../controllers/bookingController.js'
import { bookingSchema } from '../schemas/bookingSchema.js'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/authenticate.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - stationId
 *         - startTime
 *         - endTime
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique booking ID
 *           example: 1
 *         userId:
 *           type: integer
 *           description: User ID
 *           example: 2
 *         stationId:
 *           type: integer
 *           description: Station ID
 *           example: 1
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Booking start time
 *           example: "2025-11-27T14:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Booking end time
 *           example: "2025-11-27T16:00:00.000Z"
 *         status:
 *           type: string
 *           enum:
 *             - confirmed
 *             - cancelled
 *             - completed
 *           description: Booking status
 *           example: confirmed
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *         station:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *     BookingInput:
 *       type: object
 *       required:
 *         - userId
 *         - stationId
 *         - startTime
 *         - endTime
 *       properties:
 *         userId:
 *           type: integer
 *           description: User ID
 *           example: 2
 *         stationId:
 *           type: integer
 *           description: Station ID
 *           example: 1
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Booking start time
 *           example: "2025-11-27T14:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Booking end time
 *           example: "2025-11-27T16:00:00.000Z"
 *         status:
 *           type: string
 *           enum:
 *             - confirmed
 *             - cancelled
 *             - completed
 *           description: Booking status
 *           default: confirmed
 */

const router = express.Router()

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: List all bookings
 *     description: Retrieve all bookings with optional filters and pagination
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter bookings by user ID
 *       - in: query
 *         name: stationId
 *         schema:
 *           type: integer
 *         description: Filter bookings by station ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *         description: Filter bookings by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of bookings to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of bookings to skip
 *     responses:
 *       200:
 *         description: List of bookings
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
 *                       description: Total number of bookings
 *                       example: 4
 *                     count:
 *                       type: integer
 *                       description: Number of bookings returned
 *                       example: 4
 *                     bookings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 */
router.get('/', bookingController.getAll)

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: Retrieve a specific booking by its ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', bookingController.getById)

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Create a new station booking. Checks for conflicts with existing bookings.
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
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
 *       409:
 *         description: Station already booked for this time slot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authenticate,
  validate(bookingSchema),
  bookingController.create
)

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     description: Update a booking. Checks for conflicts with existing bookings.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
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
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Station already booked for this time slot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  authenticate,
  validate(bookingSchema),
  bookingController.update
)

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     description: Cancel/delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       204:
 *         description: Booking deleted successfully
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, bookingController.remove)

export default router
