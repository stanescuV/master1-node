import express from 'express'
import * as tournamentController from '../controllers/tournamentController.js'
import { tournamentSchema } from '../models/tournamentSchema.js'
import { authenticate } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'
import { validate } from '../middlewares/validate.js'

const router = express.Router()

router.get('/', tournamentController.getAll)
router.get('/:id', tournamentController.getById)

router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(tournamentSchema),
  tournamentController.create
)

router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(tournamentSchema),
  tournamentController.update
)

router.delete(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  tournamentController.remove
)

// Status management
router.patch(
  '/tournaments/:id/status',
  authenticate,
  validate(tournamentSchema),
  tournamentController.updateStatus
)


export default router
