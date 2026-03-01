import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/shopContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl, setUserId } = useContext(ShopContext); // ✅ Add setUserId
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log("Backend URL from context:", backendUrl); 
      
      if (currentState === "Sign up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        console.log("Registration response:", response.data); // Debug log

        if (response.data.success) {
          // Store token
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          
          // ✅ STORE USER ID from response
          const userId = response.data.userId || response.data.user?._id;
          if (userId) {
            localStorage.setItem("userId", userId);
            if (setUserId) setUserId(userId); // Update context if setUserId exists
            console.log("Stored userId:", userId);
          }
          
          toast.success("Registration successful!");
          // navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        
        console.log("Login response:", response.data); // Debug log
        
        if (response.data.success) {
          // Store token
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          
          // ✅ STORE USER ID from response
          const userId = response.data.userId || response.data.user?._id;
          if (userId) {
            localStorage.setItem("userId", userId);
            if (setUserId) setUserId(userId); // Update context if setUserId exists
            console.log("Stored userId:", userId);
          } else {
            console.warn("No userId in response:", response.data);
          }
          
          toast.success("Login successful!");
          // navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data?.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        // No response received
        toast.error("Cannot connect to server. Check if backend is running.");
      } else {
        // Request setup error
        toast.error("Something went wrong: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
   if(token){
    navigate('/')
   }
  },[token])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        {currentState === "Login" ? null : (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Name"
            required
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          required
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Password"
          required
        />

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>

          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign up")}
              className="cursor-pointer"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer"
            >
              Login Here
            </p>
          )}
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="bg-black text-white font-light px-8 py-2 mt-4 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : (currentState === "Login" ? "Sign In" : "Sign Up")}
        </button>
      </form>
    </div>
  );
}

export default Login;