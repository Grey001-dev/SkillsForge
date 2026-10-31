import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { prisma } from '../config/prisma.js'

export const Register=async(req,res)=>{
    const {username,email,password}=req.body;
    try {
        if(!email  || !username || !password){
        return res.status(400).json({message:"Please return all credentials"});
    }
    const emailExists=await prisma.user.findUnique({where:{email:email}});
    if(emailExists){
        return res.status(400).json({message:"Email already exists"});
    }
    const usernameExists=await prisma.user.findUnique({where:{username:username}});
    if(usernameExists){
        return res.status(400).json({message:"Username already exists"});
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=await prisma.user.create({
        data:{email,username,password:hashPassword}
    })
    const token=jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.status(201).json({message:"User created successfully" , user:{username:user.username,email:user.email},token:token});
    
    } catch (error) {
        return res.status(500).json({message:'Authentication error'})
    }

}

export const Login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email || !password){
        return res.status(401).json({message:"Provide all credentials"});
    }
    const existingUser=await prisma.user.findUnique({where:{email:email}});
    if(!existingUser){
        return res.status(404).json({message:"Invalid credentials"});
    }
    const correctPassword=await bcrypt.compare(password,existingUser.password);
    if(!correctPassword){
        return res.status(401).json({message:"Invalid credentials"});
    }
    const token=jwt.sign({ id: existingUser.id  }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.status(200).json({message:"Login succcessful",user:{username:existingUser.username, email:existingUser.email},token:token});
    
    } catch (error) {
        return res.status(500).json({message:"Authentication error"});
    }
}