import {prisma} from "../config/prisma.js";

export const createCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const name = req.body.name?.trim();

        if (!name) {
            return res.status(400).json({ message: "Invalid category" });
        }
        const categoryExists = await prisma.category.findFirst({
            where: { name, userId }
        });
        if (categoryExists) {
            return res.status(409).json({ message: "Category already exists" });
        }
        const category = await prisma.category.create({
            data: { name, userId }
        });
        return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getCategory=async(req,res)=>{
    try {
        const userId=req.user.id;
        const categories=await prisma.category.findMany({
            where:{
                userId
            }
        })
        if(categories.length==0){
            return res.status(400).json({message:"No existing category yet"})
        }
        return res.status(200).json({message:"Successfully fetches categories", category:categories});
    } catch (error) {
        return res.status(500).json({message:"server error"});
    }
}

export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name } = req.body
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' })
    if (!name) return res.status(400).json({ message: 'Name is required' })

    const result = await prisma.category.updateMany({
      where: { id, userId: req.user.id },
      data: { name }
    })
    if (result.count === 0) return res.status(404).json({ message: "This category doesn't exist" })

    const category = await prisma.category.findFirst({ where: { id, userId: req.user.id } })
    return res.status(200).json({ message: 'Category updated successfully', category })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' })

    const inUse = await prisma.expense.count({ where: { categoryId: id, userId: req.user.id } })
    if (inUse > 0) return res.status(400).json({ message: 'Category has expenses, delete or move them first' })

    const result = await prisma.category.deleteMany({
      where: { id, userId: req.user.id }
    })
    if (result.count === 0) return res.status(404).json({ message: "This category doesn't exist" })

    return res.status(200).json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}