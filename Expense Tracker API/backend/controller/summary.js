import { prisma } from '../config/prisma.js'

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id
    const { from, to } = req.query

    const where = { userId }
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }

    const total = await prisma.expense.aggregate({
      where,
      _sum: { amount: true }
    })

    const grouped = await prisma.expense.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true }
    })

    const categories = await prisma.category.findMany({ where: { userId } })

    const perCategory = grouped.map(g => {
      const cat = categories.find(c => c.id === g.categoryId)
      return { category: cat.name, total: Number(g._sum.amount) }
    })

    return res.status(200).json({
      totalSpent: Number(total._sum.amount || 0),
      perCategory
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}