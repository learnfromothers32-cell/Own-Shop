import React, { useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import NewsLatestBox from "../components/NewsLatestBox";
import axios from "axios"; 
import { toast } from "react-toastify"; 
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] },
  }),
};

const contactDetails = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
    label: "Visit Us",
    lines: ["Ship House, Opposite Main Station", "Ashaiman, Accra, Ghana"],
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
    label: "Call Us",
    lines: ["+233 538-281-749", "Mon – Sat, 9am – 6pm GMT"],
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    label: "Email Us",
    lines: ["asantekelvin229@gmail.com", "We reply within 24 hours"],
  },
];

const openRoles = [
  { title: "Senior Frontend Engineer", dept: "Engineering", type: "Full-time" },
  { title: "Brand & Creative Director", dept: "Marketing", type: "Full-time" },
  { title: "Customer Experience Lead", dept: "Support", type: "Full-time" },
  {
    title: "Buying & Merchandising Intern",
    dept: "Buying",
    type: "Internship",
  },
];

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [focused, setFocused] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ UPDATED: Real API call to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formState.name || !formState.email || !formState.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(`${backendUrl}/api/contact/send`, {
        name: formState.name,
        email: formState.email,
        message: formState.message,
      });

      if (response.data.success) {
        setSubmitted(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 ${
      focused === field
        ? "border-violet-500 bg-white/[0.08]"
        : "border-white/10 hover:border-white/20"
    }`;

  return (
    <div className="w-full">
      {/* ── Page header ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-12 border-t border-gray-100 mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "2.5rem" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[1.5px] bg-[#414141]"
            />
            <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-gray-400">
              We'd Love to Hear From You
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "2.5rem" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[1.5px] bg-[#414141]"
            />
          </div>
          <div className="text-3xl sm:text-4xl">
            <Title text1={"CONTACT"} text2={"US"} />
          </div>
          <p className="mt-4 text-sm text-gray-400 max-w-md mx-auto">
            Questions, feedback, or just want to say hi? We're here for all of
            it.
          </p>
        </motion.div>
      </div>

      {/* ── Store info + image ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="w-full"
          >
            <div className="rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[4/5] w-full">
              <motion.img
                src={assets.contact_img}
                alt="Our Store"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-violet-500">
                Our Store
              </span>
              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-semibold text-[#1a1a1a] mt-3 leading-snug">
                Come Say Hello.
                <br />
                We're Open 6 Days a Week.
              </h2>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-md">
                Whether you want to browse in person, pick up an order, or just
                talk fashion — our doors are always open. Stop by anytime.
              </p>
            </div>

            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
              {contactDetails.map(({ icon, label, lines }, i) => (
                <motion.div
                  key={label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="flex flex-col gap-2 p-5 rounded-2xl bg-gray-50 border border-gray-100 cursor-default"
                >
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-violet-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      {icon}
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mt-1">
                    {label}
                  </p>
                  {lines.map((l) => (
                    <p key={l} className="text-xs text-gray-600 leading-snug">
                      {l}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Map pill */}
            <motion.a
              href="https://maps.google.com/?q=Ashaiman,Accra,Ghana"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 hover:border-gray-400 text-xs font-semibold tracking-widest uppercase text-gray-500 hover:text-gray-800 transition-all w-fit"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Open in Maps
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* ── Contact form + side info (dark) ── */}
      <div className="w-full bg-[#0f0f0f] relative overflow-hidden mb-24">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-start">
            {/* Left: heading + perks */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="flex flex-col gap-8"
            >
              <div>
                <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-violet-400">
                  Direct Message
                </span>
                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-light text-white mt-3 leading-tight">
                  Send Us a <br />
                  <span className="font-semibold">Message</span>
                </h2>
                <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-sm">
                  Have a question, feedback, or collaboration idea? We read
                  every message personally and reply within 24 hours —
                  guaranteed.
                </p>
              </div>

              {/* Response time + perks */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: "⚡",
                    title: "Fast Replies",
                    body: "We respond within 24 hours, usually much sooner.",
                  },
                  {
                    icon: "🔒",
                    title: "Private & Secure",
                    body: "Your details are never shared with third parties.",
                  },
                  {
                    icon: "🤝",
                    title: "Real Humans",
                    body: "No bots — a real team member handles every message.",
                  },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Social links */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 mb-3">
                  Or find us on
                </p>
                <div className="flex gap-3">
                  {["Instagram", "Twitter / X", "TikTok"].map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.1, color: "#fff" }}
                      className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-[11px] font-semibold text-gray-500 transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="flex flex-col gap-5 bg-white/[0.03] border border-white/10 rounded-3xl p-8 xl:p-10"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold block mb-1.5">
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Kelvin Asante"
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused("")}
                          className={inputClass("name")}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold block mb-1.5">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="you@example.com"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused("")}
                          className={inputClass("email")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold block mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Order issue, feedback, partnership..."
                        onFocus={() => setFocused("subject")}
                        onBlur={() => setFocused("")}
                        className={inputClass("subject")}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold block mb-1.5">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            message: e.target.value,
                          })
                        }
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused("")}
                        className={`${inputClass("message")} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-60"
                    >
                      {loading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          Send Message
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="flex flex-col items-center gap-5 py-20 bg-white/[0.03] border border-white/10 rounded-3xl px-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                      <svg
                        className="w-7 h-7 text-white"
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
                    <p className="text-white font-semibold text-xl">
                      Message Sent!
                    </p>
                    <p className="text-gray-400 text-sm text-center max-w-xs leading-relaxed">
                      Thanks for reaching out,{" "}
                      <span className="text-white font-medium">
                        {formState.name.split(" ")[0] || "there"}
                      </span>
                      . We'll get back to you within 24 hours.
                    </p>
                    <motion.button
                      onClick={() => {
                        setSubmitted(false);
                        setFormState({ name: "", email: "", message: "" });
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="mt-2 text-[11px] tracking-widest uppercase text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Send another message →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Careers ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-gray-400">
                Join the Team
              </span>
              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-light text-[#1a1a1a] mt-2">
                Careers at <span className="font-semibold">Forever</span>
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
                We're building something special. If you're passionate about
                fashion, technology, or customer experience — we want to hear
                from you.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 flex items-center gap-2 px-7 py-3 rounded-full bg-[#1a1a1a] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#333] transition-colors"
            >
              View All Roles
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.button>
          </div>

          {/* Roles grid — 2 columns on xl */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {openRoles.map(({ title, dept, type }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className="group flex items-center justify-between p-5 xl:p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">
                      {title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                      type === "Internship"
                        ? "bg-violet-50 text-violet-500"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {type}
                  </span>
                  <motion.svg
                    className="w-4 h-4 text-gray-300 group-hover:text-gray-700 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </motion.svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Perks strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
          >
            {[
              { icon: "🌍", perk: "Remote-friendly" },
              { icon: "🏖️", perk: "Flexible PTO" },
              { icon: "📦", perk: "Staff wardrobe allowance" },
              { icon: "📈", perk: "Equity for early hires" },
            ].map(({ icon, perk }) => (
              <div
                key={perk}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <span className="text-xl">{icon}</span>
                <p className="text-xs font-semibold text-gray-600">{perk}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Newsletter ── */}
      <NewsLatestBox />
    </div>
  );
};

export default Contact;
