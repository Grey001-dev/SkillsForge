import express from 'express'
import authmiddleware from '../middleware/authmiddleware.js'
import { getSummary } from '../controller/summary.js'
import { setBudget, getBudget } from '../controller/budget.js'

const sumRouter = express.Router()

sumRouter.get('/summary', authmiddleware, getSummary)
sumRouter.put('/budget', authmiddleware, setBudget)
sumRouter.get('/budget', authmiddleware, getBudget)

export default sumRouter