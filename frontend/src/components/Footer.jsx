import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.33, 1, 0.68, 1] },
  }),
};

const companyLinks = [
  { label: "Home", to: "/" },
  { label: "Collection", to: "/collection" },
  { label: "About Us", to: "/about" },
  { label: "Delivery Info", to: "/delivery" },
  { label: "Privacy Policy", to: "/privacy" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
    ),
  },
];

function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-400 pt-20 pb-8 px-6 sm:px-12 mt-24">
      <div className="max-w-screen-xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-[2.5fr_1fr_1fr_1.2fr] gap-12 pb-14 border-b border-white/10">

          {/* Brand column */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link to="/">
              <motion.img
                src={assets.logo}
                alt="Forever"
                className="w-28 mb-6 brightness-0 invert"
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Curating timeless fashion for the bold and the understated alike.
              Every piece is chosen with intention — quality you can feel,
              style that endures.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-7">
              {socialLinks.map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, color: "#fff" }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {icon}
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company links */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-6">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {companyLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <motion.span
                      whileHover={{ x: 4, color: "#fff" }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-gray-500 inline-block transition-colors cursor-pointer"
                    >
                      {label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-6">
              Support
            </p>
            <ul className="flex flex-col gap-3 text-sm text-gray-500">
              {["FAQ", "Shipping & Delivery", "Returns & Exchanges", "Size Guide", "Track Order"].map((item) => (
                <li key={item}>
                  <motion.span
                    whileHover={{ x: 4, color: "#fff" }}
                    transition={{ duration: 0.2 }}
                    className="inline-block cursor-pointer transition-colors"
                  >
                    {item}
                  </motion.span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-6">
              Get In Touch
            </p>
            <ul className="flex flex-col gap-4 text-sm">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  ),
                  text: "+233 538-281-749",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ),
                  text: "asantekelvin229@gmail.com",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                  text: "Mon – Sat, 9am – 6pm GMT",
                },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-gray-500">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    {icon}
                  </svg>
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-gray-600 tracking-wide"
        >
          <p>© {new Date().getFullYear()} Forever.com — All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item, i) => (
              <React.Fragment key={item}>
                <motion.span
                  whileHover={{ color: "#fff" }}
                  className="cursor-pointer transition-colors"
                >
                  {item}
                </motion.span>
                {i < 2 && <span className="text-white/10">|</span>}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

      </div>
    </footer>
  );
}

export default Footer;