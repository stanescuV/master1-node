import { Router } from 'express'
import * as teamController from '../controllers/teamController.js'
import { teamSchema } from '../models/teamSchema.js'
import { authenticate } from '../middlewares/authenticate.js'
import { validate } from '../middlewares/validate.js'

const router = Router()

// Public
router.get('/', teamController.getAll)
router.get('/:id', teamController.getById)

// Authenticated
router.post(
  '/',
  authenticate,
  validate(teamSchema),
  teamController.create
)

router.put(
  '/:id',
  authenticate,
  validate(teamSchema),
  teamController.update
)

router.delete(
  '/:id',
  authenticate,
  teamController.remove
)

export default router
