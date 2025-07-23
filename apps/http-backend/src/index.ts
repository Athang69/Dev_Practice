import express, { Request, Response } from "express";
const app = express();
import {createRoomSchema, userSchema, signInSchema} from "@repo/common";
import { JWT_SECRET } from "@repo/backend_common/config"
import { auth } from "./middleware";
import prismaClient  from "@repo/db/client"
import { error } from "console";
import bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"


app.use(express.json())

app.post("/signup",async (req:Request,res:Response)=>{
  const parsedBody = userSchema.safeParse(req.body)
  if(!parsedBody.success){
    res.json({
      message:"The data that you entered is having invalid format",
      error:parsedBody.error.flatten().fieldErrors
    })
    return;
  }

  const email = parsedBody.data.email;
  const password = parsedBody.data.password;
  const username = parsedBody.data.username;

  let thrownError = false;
  try{
    const hashedPassword = await bcrypt.hash(password,10);
    await prismaClient.user.create({
      data:{
        email:email,
        password:hashedPassword,
        username:username,
        avatar:"any_image.png",
        name:"Athang Kali"
      }
    }) 
  }
  catch(e){
    thrownError=true;
  }
  if(thrownError){
    res.status(404).json({
      message:"Error 404"
    })
  }
  else{
    res.json({
      message:"You are signed up successfully"
    })
  }
})

app.post("/signin",async (req:Request, res:Response)=>{
  const parsedBody = signInSchema.safeParse(req.body);
  if(!parsedBody.success){
    res.json({
      message:"Invalid inputs"
    })
    return;
  }

  const email = parsedBody.data?.email;
  const password = parsedBody.data?.password;

  const user = await prismaClient.user.findUnique({
    where:{
      email:email
    }
  })
  if(!user){
    res.status(403).json({
      message:"The user doesnt exist try signing up instead"
    })
    return
  }
  const db_pass = user.password; 
  
    const verify = await bcrypt.compare(password,db_pass)
    if(verify){
      const token = jwt.sign({
        id:user.id.toString()
      },JWT_SECRET)

      res.json({
      token:token
    })
    }
    else{
      res.status(403).json({
        message:"Invalid Credentials"
      })
    }
})

app.post("/room", auth ,async (req:Request, res:Response)=>{
  const parsedBody = createRoomSchema.safeParse(req.body);
  if(!parsedBody.success){
    res.json({
      message:"Invalid inputs"
    })
    return;
  }
  const userId = req.userId
  try{
    const room = await prismaClient.room.create({
      // @ts-ignore
      data:{
        slug:parsedBody.data.roomId,
        adminId:userId
      }
    })
    res.json({
      message:"Room created successfully",
      roomId:room.slug
    })
  }
  catch(e){
    res.status(404).json({
      message:"Room already exists with this ID"
    })
    return;
  }

})

app.get("/chats/:roomId",async (req:Request,res:Response)=>{
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where:{
      roomId:roomId
    },
    orderBy:{
      id:"desc"
    },
    take:50
  })

  res.json({
    messages
  })
})

app.listen(3002)