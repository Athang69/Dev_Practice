import axios from "axios";

import { HTTP_URL } from "../config";

type Shape =
{
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
}|{
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}|{
    type:"line";
    startX : number;
    startY : number;
    endX : number;
    endY : number;
} | {
    type:"arrow";
    startX : number;
    startY : number;
    endX:number;
    endY:number
} | {
  type:"pencil";
  points:{x:number, y:number}[]
} | {
  type:"text";
  x:number,
  y:number,
  content:string
}

export default async function InitDraw(
  canvas: HTMLCanvasElement,
  shapeType: string, 
  { roomId }:{
    roomId:string
  } 
) {
  let currentPoints : {x:number, y:number}[] = []
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const existingShapes: Shape[] = await getExistingShapes(roomId);
  drawAllShapes(existingShapes, canvas, ctx);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  canvas.onmousedown = (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;

    if (shapeType === "pencil") {
      currentPoints = [{x:startX, y:startY}]
    }

  if (shapeType === "text") {
  const input = document.createElement("input");
  input.type = "text";

  input.style.position = "absolute";
  input.style.left = `${e.clientX}px`;
  input.style.top = `${e.clientY}px`;

  input.style.background = "transparent";
  input.style.color = "rgba(131, 181, 255, 1)";
  input.style.border = "none";
  input.style.outline = "none";
  input.style.font = "16px sans-serif";
  input.style.zIndex = "1000"; 
  input.style.width = "200px"; 

  document.body.appendChild(input);
  input.focus();

  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      const content = input.value.trim();
      if (content !== "") {
        existingShapes.push({
          type: "text",
          x: e.clientX,
          y: e.clientY,
          content,
        });
        drawAllShapes(existingShapes, canvas, ctx);
      }
      document.body.removeChild(input);
    } else if (ev.key === "Escape") {
      document.body.removeChild(input);
    }
  });

  return; 
}


};

  canvas.onmouseup = (e) => {
    if (!isDrawing) return;
    isDrawing = false;

    const endX = e.clientX;
    const endY = e.clientY;

    const width = endX - startX;
    const height = endY - startY;

    if (shapeType === "rect") {
      existingShapes.push({
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      });
    } else if (shapeType === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      existingShapes.push({
        type: "circle",
        centerX: startX,
        centerY: startY,
        radius,
      });
    } else if (shapeType === "line") {
      existingShapes.push({
        type:"line",
        startX:startX,
        startY:startY,
        endX:endX,
        endY:endY,
      })
    } else if (shapeType === "arrow"){
      existingShapes.push({
        type:"arrow",
        startX:startX,
        startY:startY,
        endX:endX,
        endY:endY,
      })
    } else if (shapeType === "pencil") {
      existingShapes.push({
        type:"pencil",
        points:[...currentPoints]
      })
      currentPoints = []
    }

    drawAllShapes(existingShapes, canvas, ctx);
  };

  canvas.onmousemove = (e) => {
    if (!isDrawing) return;

    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Live preview
    drawAllShapes(existingShapes, canvas, ctx);
    ctx.strokeStyle = "rgba(131, 181, 255, 1)";

    if (shapeType === "rect") {
      ctx.strokeRect(startX, startY, width, height);
    } else if (shapeType === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shapeType === "line") {
      ctx.beginPath();
      ctx.moveTo(startX,startY)
      ctx.lineTo(e.clientX, e.clientY)
      ctx.stroke()
    } else if(shapeType === "arrow") {
      drawArrow(ctx, startX, startY, e.clientX, e.clientY);
    } else if (shapeType === "pencil") {
      currentPoints.push({
        x:currentX, 
        y:currentY
      })
      drawAllShapes(existingShapes, canvas, ctx);
      if(currentPoints.length>0){
      ctx.beginPath();
      //@ts-ignore
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        //@ts-ignore
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      ctx.stroke();
      return;
    }
  }
}
  };

function drawAllShapes(
  shapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  shapes.forEach((shape) => {
    ctx.strokeStyle = "rgba(131, 181, 255, 1)";
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    else if (shape.type === "line"){
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY)
      ctx.lineTo(shape.endX, shape.endY)
      ctx.stroke()
    } else if (shape.type === "arrow") {
      drawArrow(ctx, shape.startX, shape.startY, shape.endX, shape.endY);
    } else if (shape.type === "pencil") {
    if (shape.points.length > 1) {
    ctx.beginPath();
    //@ts-ignore
    ctx.moveTo(shape.points[0].x, shape.points[0].y);
    for (let i = 1; i < shape.points.length; i++) {
      //@ts-ignore
      ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }
    ctx.stroke();
  } 
 } else if (shape.type === "text") {
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "rgba(131, 181, 255, 1)";
  ctx.fillText(shape.content, shape.x, shape.y);
}
});
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const headLength = 10;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);

  // Arrowhead
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );

  ctx.stroke();
}

async function getExistingShapes(roomId:string){
  const res:any = await axios.get(`${HTTP_URL}/chats/${roomId}`)
  console.log(res.data)
  const messages = res.data.messages;
  
  const shapes = messages.map((x:{message:string})=>{
    const messageData = JSON.parse(x.message)
    return messageData
  })
  return shapes;
}