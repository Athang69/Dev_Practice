"use client"
import { AuthPage } from "../../Components/Authpage";

function Signin(){
  return <>
    <AuthPage isSignin={true}/>
  </>
}

export default Signin;