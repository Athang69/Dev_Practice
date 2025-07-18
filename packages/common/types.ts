import { z } from "zod"

const userSchema = z.object({
  email:z.email({
    error:"Enter valid email adress"
  }),
  password:z.string().min(8,{
    error:"Password must be minimum 8 characters long"
  }).
  max(25,{
    error:"Password cannot be more than 25 characters"
  }).refine((val)=>{
      return(
        /[a-z]/.test(val)&&
        /[A-Z]/.test(val)&&
        /[^a-zA-Z0-9]/.test(val)
      )
  }),
  username:z.string().min(5).max(25)
})

const signInSchema = z.object({
  email:z.email(),
  password:z.string().min(8).max(25)
})

const createRoomSchema = z.object({
  roomId:z.string().min(3).max(20)
}) 

export {
  signInSchema,
  userSchema,
  createRoomSchema
}