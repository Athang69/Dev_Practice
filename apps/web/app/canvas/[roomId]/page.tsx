"use client"
import { useEffect, useRef } from "react"

export default function Canvas(){
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    if(canvasRef.current){
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let mouseClicked = false;
    let orgX = 0;
    let orgY = 0;
    let endX = 0;
    let endY = 0;
    

    canvas.addEventListener("mousedown",(e)=>{
      mouseClicked = true
      orgX = e.clientX;
      orgY = e.clientY;


    })
    canvas.addEventListener("mouseup",(e)=>{
      mouseClicked = false
    })

    canvas.addEventListener("mousemove",(e)=>{
      if(mouseClicked){
        const widthRect = e.clientX - orgX
        const heightRect = e.clientY - orgY
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        ctx?.strokeRect(orgX, orgY, widthRect, heightRect)
      }
    })

    }
  },[canvasRef])
  return <div> 
    <canvas ref={canvasRef} className="fixed block top-0 left-0 bg-white"></canvas>
  </div>
}

