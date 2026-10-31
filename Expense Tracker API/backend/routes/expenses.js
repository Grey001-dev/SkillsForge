import express from 'express'
import authmiddleware from '../middleware/authmiddleware.js'
import {
  createExpenses, getExpenses, getExpense, updateExpense, deleteExpense, exportExpenses
} from '../controller/expenses.js'

const router = express.Router();

router.post('/', authmiddleware, createExpenses);
router.get('/', authmiddleware, getExpenses);
router.get('/export', authmiddleware, exportExpenses);
router.get('/:id', authmiddleware, getExpense);
router.put('/:id', authmiddleware, updateExpense);
router.delete('/:id', authmiddleware, deleteExpense);

export default router;