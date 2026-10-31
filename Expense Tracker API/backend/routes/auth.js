import express from 'express';
import {Register,Login} from "../controller/auth.js";
const authRouter=express.Router();
authRouter.post('/register', Register)
authRouter.post('/login', Login)

export default authRouter;

