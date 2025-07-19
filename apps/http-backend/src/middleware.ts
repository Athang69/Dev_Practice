import { JWT_SECRET } from "@repo/backend_common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

declare global {
  namespace Express{
    interface Request{
      userId?:string
    }
  }
}

export function auth(req:Request, res:Response, next:NextFunction){
  const token = req.headers['authorization'] ?? "";
  const decodedData = jwt.verify(token,JWT_SECRET)
  if(decodedData){
    //@ts-ignore
    req.userId = decodedData.userId;
    next();
  }
  else{
    res.status(403).json({
      message:"Unable to authenticate"
    })
  }
}