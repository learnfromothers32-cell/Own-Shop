import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const NewsLatestBox = () => {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      // TODO: await axios.post("/api/newsletter/subscribe", { email });
      await new Promise((r) => setTimeout(r, 900)); // simulated delay
      setSubmitted(true);
      toast.success("You're in! Check your inbox for your 20% off code.");
      setEmail("");
    } catch (error) {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0f0f0f] py-24 px-4">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "2rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] bg-violet-400"
          />
          <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-violet-400">
            Exclusive Offer
          </span>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "2rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] bg-violet-400"
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl font-light text-white leading-tight tracking-tight mb-4">
            Get{" "}
            <span className="font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              20% Off
            </span>{" "}
            Your First Order
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Join 50,000+ subscribers getting early access to new drops, styling
            tips, and members-only deals — straight to their inbox.
          </p>
        </motion.div>

        {/* Perks row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mt-8 mb-10"
        >
          {[
            { icon: "✦", label: "Early Access to Drops" },
            { icon: "✦", label: "Members-Only Deals" },
            { icon: "✦", label: "Unsubscribe Anytime" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-gray-500 uppercase"
            >
              <span className="text-violet-400 text-[8px]">{icon}</span>
              {label}
            </span>
          ))}
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              onSubmit={onSubmitHandler}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative flex items-center max-w-md mx-auto"
            >
              {/* Input glow ring when focused */}
              <motion.div
                animate={{
                  boxShadow: focused
                    ? "0 0 0 3px rgba(139,92,246,0.25)"
                    : "0 0 0 0px rgba(139,92,246,0)",
                }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full pl-5 pr-1 py-1 backdrop-blur-sm"
              >
                {/* Mail icon */}
                <svg
                  className="w-4 h-4 text-gray-500 shrink-0 mr-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none py-3"
                />

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="shrink-0 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[11px] font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-full transition-all hover:from-violet-400 hover:to-indigo-400 disabled:opacity-60"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full mx-3"
                    />
                  ) : (
                    "Subscribe"
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">
                You're on the list!
              </p>
              <p className="text-gray-400 text-sm">
                Your 20% off code is on its way to your inbox.
              </p>
              <motion.button
                onClick={() => setSubmitted(false)}
                whileHover={{ scale: 1.05 }}
                className="mt-2 text-[11px] tracking-widest uppercase text-gray-500 hover:text-gray-300 transition-colors"
              >
                Subscribe another email →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-[11px] text-gray-600 mt-6 tracking-wide"
        >
          No spam, ever. We respect your privacy. Unsubscribe at any time.
        </motion.p>
      </div>
    </section>
  );
};

export default NewsLatestBox;
