import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/shopContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl, setUserId } = useContext(ShopContext);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // 1. Determine endpoint based on state
      const endpoint = currentState === "Login" ? "/api/user/login" : "/api/user/register";
      const payload = currentState === "Login" ? { email, password } : { name, email, password };

      const response = await axios.post(backendUrl + endpoint, payload);

      if (response.data.success) {
        const { token, userId, user } = response.data;
        const finalUserId = userId || user?._id;

        // 2. Update Context
        setToken(token);
        if (setUserId && finalUserId) setUserId(finalUserId);

        // 3. Update LocalStorage
        localStorage.setItem("token", token);
        if (finalUserId) localStorage.setItem("userId", finalUserId);

        toast.success(`${currentState} successful!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMsg = error.response?.data?.message || "Connection failed. Is the backend running?";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-full max-w-sm gap-4 text-gray-700 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex flex-col items-center gap-2 mb-6">
          <h2 className="prata-regular text-4xl text-black">{currentState}</h2>
          <div className="h-1 w-12 bg-black rounded-full" />
        </div>

        {currentState !== "Login" && (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:border-black outline-none transition-all"
            placeholder="Full Name"
            required
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded focus:border-black outline-none transition-all"
          placeholder="Email Address"
          required
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded focus:border-black outline-none transition-all"
          placeholder="Password"
          required
        />

        <div className="w-full flex justify-between text-xs font-medium text-gray-500 mt-[-4px]">
          <span className="hover:text-black cursor-pointer transition-colors">Forgot password?</span>
          {currentState === "Login" ? (
            <span onClick={() => setCurrentState("Sign up")} className="text-black cursor-pointer underline underline-offset-4">
              Create account
            </span>
          ) : (
            <span onClick={() => setCurrentState("Login")} className="text-black cursor-pointer underline underline-offset-4">
              Login here
            </span>
          )}
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-bold py-3 mt-4 rounded hover:bg-gray-900 active:scale-[0.98] transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            currentState === "Login" ? "Sign In" : "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;