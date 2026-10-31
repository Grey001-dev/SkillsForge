import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import Catrouter from './routes/categories.js'
import expenseRouter from './routes/expenses.js'
import sumRouter from './routes/summary.js'

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/category', Catrouter)
app.use('/api/expenses', expenseRouter)
app.use('/api', sumRouter)

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})