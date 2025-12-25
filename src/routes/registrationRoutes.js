import { Router } from 'express'

import * as registrationController from '../controllers/registrationController.js'
import {
  registrationSchema,
  registrationStatusSchema
} from '../models/registrationSchema.js'

import { authenticate } from '../middlewares/authenticate.js'
import { validate } from '../middlewares/validate.js'

const router = Router()

router.post(
  '/:tournamentId/register',
  authenticate,
  validate(registrationSchema),
  registrationController.register
)

router.get(
  '/:tournamentId/registrations',
  authenticate,
  registrationController.getAll
)

router.patch(
  '/:tournamentId/registrations/:id',
  authenticate,
  validate(registrationStatusSchema),
  registrationController.updateStatus
)

router.delete(
  '/:tournamentId/registrations/:id',
  authenticate,
  registrationController.remove
)

export default router
