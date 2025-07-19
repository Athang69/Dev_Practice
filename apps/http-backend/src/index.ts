import express, { Request, Response } from "express";
const app = express();
import {createRoomSchema, userSchema, signInSchema} from "@repo/common";
import { JWT_SECRET } from "@repo/backend_common/config"
import { auth } from "./middleware";
const bcrypt = require("bcrpyt")
app.use(express.json())

app.post("/signup",async (req:Request,res:Response)=>{
  const body = userSchema.safeParse(req.body);
  
  if(!body.success){
    res.json({
      message:"Incorrect Inputs"
    })
  }
  return;

  const hashedPassword = await bcrypt.hash(body.data?.password,10)

  
})

app.post("/signin",async (req:Request, res:Response)=>{
  const body = signInSchema.safeParse(req.body);
  if(!body.success){
    res.json({
      message:"Invalid inputs"
    })
  }
  return;
})

app.post("/room", auth ,async (req:Request, res:Response)=>{
  const body = createRoomSchema.safeParse(req.body);
  if(!body.success){
    res.json({
      message:"Invalid inputs"
    })
  }
  return;
})

app.listen(3000)