import express from 'express'
import authmiddleware from '../middleware/authmiddleware.js'
import { createCategory, getCategory, updateCategory, deleteCategory } from '../controller/category.js'

const Catrouter = express.Router()


Catrouter.post('/', authmiddleware, createCategory)
Catrouter.get('/', authmiddleware, getCategory)
Catrouter.put('/:id', authmiddleware, updateCategory)
Catrouter.delete('/:id', authmiddleware, deleteCategory)

export default Catrouter