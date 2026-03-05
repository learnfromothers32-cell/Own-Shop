import axios from "axios";
import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/* ── Inline icons ── */
const Icons = {
  mail: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  lock: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  lockSmall: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  eye: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  eyeOff: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  shield: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
};

/* ── Field wrapper ── */
const Field = ({ label, icon, rightSlot, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">{label}</span>
    <div className="relative group">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-500 transition-colors pointer-events-none">
        {icon}
      </span>
      {React.cloneElement(children, {
        className:
          "w-full border border-gray-200 rounded-xl py-3 pl-9 pr-10 text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:border-gray-400 transition-colors duration-200",
      })}
      {rightSlot && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>
      )}
    </div>
  </div>
);

/* ── Variants ── */
const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] } },
};

const fieldVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.07, duration: 0.45, ease: [0.33, 1, 0.68, 1] } }),
};

const Login = ({ setToken }) => {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await axios.post(backendUrl + "/api/user/admin", { email, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-50/50 px-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >

        {/* ── Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">

            {/* Icon badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 text-gray-400"
            >
              {Icons.shield}
            </motion.div>

            {/* Title — matches app-wide header pattern */}
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "2rem" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-[1.5px] bg-[#414141] shrink-0"
              />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                Restricted Access
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] tracking-tight">
              Admin <span className="text-gray-400 font-medium">Panel</span>
            </h1>
            <p className="mt-1.5 text-xs text-gray-400 tracking-wide">
              Sign in with your administrator credentials.
            </p>
          </div>

          {/* Card body */}
          <form onSubmit={onSubmitHandler} className="px-8 py-7 flex flex-col gap-5">

            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <Field label="Email Address" icon={Icons.mail}>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Field>
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
              <Field
                label="Password"
                icon={Icons.lock}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPassword ? Icons.eyeOff : Icons.eye}
                  </button>
                }
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Field>
            </motion.div>

            {/* Submit */}
            <motion.div
              custom={2} variants={fieldVariants}
              initial="hidden" animate="visible"
              className="pt-1 flex flex-col gap-3"
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, backgroundColor: "#333" } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="group w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-[0.25em] uppercase py-3.5 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="login"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Sign In
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        {Icons.arrowRight}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Trust line */}
              <p className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
                {Icons.lockSmall}
                Secure connection · Admin only
              </p>
            </motion.div>
          </form>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[10px] text-gray-400 tracking-wide mt-5"
        >
          Unauthorised access is strictly prohibited.
        </motion.p>

      </motion.div>
    </div>
  );
};

export default Login;