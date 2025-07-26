import axios from "axios";
import { HTTP_URL } from "../../config";
import { ChatRoom } from "../../../Components/ChatRoom";
async function getRoomId(slug:string){
  const response:any = await axios.get(`${HTTP_URL}/room/${slug}`)
  return response.data.room
  console.log(response)
}

export default async function ChatRoom1(
  {params}:
{
  params:{
    slug:string
  }
}){
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);
  return <ChatRoom id={roomId} />
}