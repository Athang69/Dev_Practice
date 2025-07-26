import Link from "next/link";
import { InputBox } from "./Inputbox";
import Button from "./button";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex bg-gradient-to-r from-indigo-100 to-blue-100">
      
      {/* Left Graphic Section */}
      <div className="w-1/2 hidden md:flex items-center justify-end pr-10">
        <div className="text-right max-w-sm">
          <img
            src="https://static.thenounproject.com/png/7309741-512.png"
            alt="Teaching Illustration"
            className="w-52 h-52 mx-auto mb-2"
          />
          <h2 className="text-2xl font-bold text-indigo-700 leading-tight">
            Collaborative Teaching
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Engage. Learn. Grow — Together!
          </p>
        </div>
      </div>

      {/* Right Auth Section */}
      <div className="w-full md:w-1/2 flex items-center justify-start pl-10">
        <div className="bg-white rounded-lg shadow-md px-8 py-6 w-full max-w-sm">
          <h1 className="text-xl font-bold text-center text-indigo-800 mb-4">
            {isSignin ? "Sign in to your account" : "Create a new account"}
          </h1>

          <form className="flex flex-col gap-3">
            <InputBox

              type="text"
              placeholder="Enter Email"
              required
              className="text-black rounded-md border border-gray-300 p-3"
            />

            <InputBox
              type="password"
              placeholder="Enter Password"
              required
              className="text-black rounded-md border border-gray-300 p-3"
            />

            {!isSignin && (
              <InputBox
                type="text"
                placeholder="Enter Username"
                required
                className="text-black rounded-md border border-gray-300 p-3"
              />
            )}

            <Button
              text={isSignin ? "Sign In" : "Sign Up"}
              type="submit"
              className="text-white bg-indigo-600 hover:bg-indigo-700 transition-colors p-3 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                alert("Form Submitted!");
              }}
            />
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            {isSignin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link href={isSignin?"/signup":"/signin"} >
              <span className="text-indigo-600 cursor-pointer hover:underline">
                {isSignin ? "Sign Up" : "Sign In"}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
