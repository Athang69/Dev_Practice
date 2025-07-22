import { JWT_SECRET } from "@repo/backend_common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express{
    interface Request{
      userId?:string
    }
  }
}

export function auth(req:Request, res:Response, next:NextFunction){
  const token = req.headers['authorization'] ?? "";
  const decodedData:any = jwt.verify(token,JWT_SECRET)
  if(decodedData){
    req.userId = decodedData.userId;
    next();
  }
  else{
    res.status(403).json({
      message:"Unable to authenticate"
    })
  }
}