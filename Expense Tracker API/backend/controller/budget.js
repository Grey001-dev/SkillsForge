import { prisma } from '../config/prisma.js'

export const setBudget = async (req, res) => {
  try {
    const { monthlyBudget } = req.body
    if (isNaN(Number(monthlyBudget)) || Number(monthlyBudget) <= 0) {
      return res.status(400).json({ message: 'Budget must be a positive number' })
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { monthlyBudget: Number(monthlyBudget) }
    })

    return res.status(200).json({ message: 'Budget set', monthlyBudget: Number(monthlyBudget) })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getBudget = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user.monthlyBudget) {
      return res.status(404).json({ message: 'No budget set' })
    }

    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const spent = await prisma.expense.aggregate({
      where: { userId, date: { gte: start, lt: end } },
      _sum: { amount: true }
    })

    const totalSpent = Number(spent._sum.amount || 0)
    const budget = Number(user.monthlyBudget)

    return res.status(200).json({
      budget,
      totalSpent,
      remaining: budget - totalSpent,
      exceeded: totalSpent > budget
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}