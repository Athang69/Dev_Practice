import WebSocket, {WebSocketServer} from "ws";
import { JWT_SECRET } from "@repo/backend_common/config"
import jwt, {JwtPayload} from "jsonwebtoken";
import prismaClient  from "@repo/db/client" 
import { parse } from "path";

interface Users_Type{
  ws: WebSocket,
  rooms:string[],
  userId:string
}

const users:Users_Type[] = []

const wss = new WebSocketServer({port:8080});
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded.id;
  } catch(e) {
    return null;
  }
}

wss.on('connection',function connection(ws,request)
{
  const url = request.url;
  if(!url){
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || ""
  const userId = checkUser(token)
  if(userId === null){
    ws.close
    return null
  }

  users.push({
    ws:ws,
    userId:userId,
    rooms:[]
  })

  ws.on("message",async function message(data){
    const parsedData = JSON.parse(data as unknown as string);
    if (parsedData.type === "join_room"){
      const user = users.find(x=> x.ws === ws)
      const room_chk = prismaClient.room.findFirst({
        where:{
          slug:parsedData.roomId
        }
      })
      if(!room_chk){
        return
      }
      else{
        user?.rooms.push(parsedData.roomId)
      }
    }
    if(parsedData.type === "leave_room"){
      const user = users.find(x=>x.ws === ws)
      if(!user){
        return
      }
      else{
        user.rooms = user?.rooms.filter(x=> x === parsedData.room)
      }
    }

    if(parsedData.type === "chat"){
      const roomId = parsedData.roomId;
      const message = parsedData.message

      await prismaClient.chat.create({
        data:{
          userId,
          roomId,
          message
        }
      })

      users.forEach(user=>{
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type:"chat",
            message:message,
            roomId
          }))
        }
      })
    }
  })


})