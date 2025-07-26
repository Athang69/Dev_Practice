"use client"
import { AuthPage } from "../../Components/Authpage";

function Signup(){
  return <>
    <AuthPage isSignin={false}/>
  </>
}

export default Signup;