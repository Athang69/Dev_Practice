import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text:string

}

export default function Button({text, ...rest}:ButtonProps){
  return <button className="bg-blue-700 text-white w-[300px] h-[60px] rounded-md cursor-pointer" {...rest}>{text}</button>
}