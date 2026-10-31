import { prisma } from '../config/prisma.js'
export const createExpenses =async(req,res)=>{
    try {
        const userId=req.user.id;
    const {title, amount, category, date, paymentMethod}=req.body;
    if(!title || !amount || !category || !date || !paymentMethod){
        return res.status(400).json({message:"Invalid credentials"});
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }
    if (Number.isNaN(Number(category))) {
      return res.status(400).json({ message: 'Invalid categoryId' })
    }
    if (date && isNaN(new Date(date))) {
      return res.status(400).json({ message: 'Invalid date' })
    }
    const existingCategory=await prisma.category.findFirst({
        where:{id: Number(category),userId:userId}
    })
    if(!existingCategory){
        return res.status(400).json({message:"Category doesn't exist"})
    }
    const expense=await prisma.expense.create({
    data: { title, amount:Number(amount), categoryId:Number(category), date:new Date(date),paymentMethod,userId:userId }
    })
        return res.status(201).json({message:"Succesfully saved your expense",expense});
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Server error"});
    }
}

export const getExpense = async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' })

    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.user.id },
      include: { category: true }
    })
    if (!expense) return res.status(404).json({ message: 'Expense not found' })
    return res.status(200).json(expense)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}


export const deleteExpense = async (req, res) => {
  try {
    const userId=req.user.id;
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' })

    const result = await prisma.expense.deleteMany({
      where: { id, userId }
    })
    if (result.count === 0) return res.status(404).json({ message: 'Expense not found' })
    return res.status(200).json({ message: 'Expense deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getExpenses = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const { categoryId, paymentMethod, from, to, sortBy, order } = req.query
    const userId=req.user.id;
    const where = {
         userId: userId 
        };
    if (categoryId) where.categoryId = Number(categoryId)
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }

    const sortField = sortBy === 'amount' ? 'amount' : 'date'
    const sortOrder = order === 'asc' ? 'asc' : 'desc'

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true }
    })
    const total = await prisma.expense.count({ where })

    return res.status(200).json({
      expenses,
      page,
      total,
      totalPages: Math.ceil(total / limit)
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}


export const updateExpense = async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' })

    const { title, amount, paymentMethod, categoryId, date } = req.body
    const data = {}

    if (title !== undefined) {
      if (!title) return res.status(400).json({ message: 'Title cannot be empty' })
      data.title = title
    }
    if (amount !== undefined) {
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' })
      }
      data.amount = Number(amount)
    }
    if (paymentMethod !== undefined) {
      if (!paymentMethod) return res.status(400).json({ message: 'paymentMethod cannot be empty' })
      data.paymentMethod = paymentMethod
    }
    if (date !== undefined) {
      if (isNaN(new Date(date))) return res.status(400).json({ message: 'Invalid date' })
      data.date = new Date(date)
    }
    if (categoryId !== undefined) {
      if (Number.isNaN(Number(categoryId))) {
        return res.status(400).json({ message: 'Invalid categoryId' })
      }
      const category = await prisma.category.findFirst({
        where: { id: Number(categoryId), userId: req.user.id }
      })
      if (!category) return res.status(400).json({ message: 'Category not found' })
      data.categoryId = category.id
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' })
    }

    const result = await prisma.expense.updateMany({
      where: { id, userId: req.user.id },
      data
    })
    if (result.count === 0) return res.status(404).json({ message: 'Expense not found' })

    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.user.id },
      include: { category: true }
    })
    return res.status(200).json(expense)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const exportExpenses = async (req, res) => {
  try {
    const { categoryId, paymentMethod, from, to } = req.query

    const where = { userId: req.user.id }
    if (categoryId) where.categoryId = Number(categoryId)
    if (paymentMethod) where.paymentMethod = paymentMethod
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { category: true }
    })

    const perCategory = {}
    let totalSpent = 0
    for (const e of expenses) {
      const amount = Number(e.amount)
      totalSpent += amount
      perCategory[e.category.name] = (perCategory[e.category.name] || 0) + amount
    }

    const report = {
      generatedAt: new Date().toISOString(),
      totalSpent,
      perCategory,
      count: expenses.length,
      expenses: expenses.map(e => ({
        title: e.title,
        amount: Number(e.amount),
        category: e.category.name,
        paymentMethod: e.paymentMethod,
        date: e.date.toISOString().split('T')[0]
      }))
    }

    res.setHeader('Content-Disposition', 'attachment; filename="expenses-report.json"')
    return res.status(200).json(report)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}