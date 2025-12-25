import express from 'express'
import * as tournamentController from '../controllers/tournamentController.js'
import { tournamentSchema, tournamentStatusSchema } from '../schemas/tournamentSchema.js'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'

const router = express.Router()



export default router
