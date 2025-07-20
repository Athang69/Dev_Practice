import WebSocket, {WebSocketServer} from "ws";
import { JWT_SECRET } from "@repo/backend_common/config"
import jwt, {JwtPayload} from "jsonwebtoken";

const wss = new WebSocketServer({port:8080});
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
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
})