import axios from "axios"
import { HTTP_URL } from "../app/config"
import { ChatRoomCLient } from "./ChatRoomClient"

function getChats(roomId:string){
  const reponse:any = axios.get(`${HTTP_URL}/chats/${roomId}`)
  return reponse.data.messages
}


export async function ChatRoom({id}:{
  id:string
}){
  const messages = await getChats(id) 
  return <ChatRoomCLient id={id} messages={messages} />
}