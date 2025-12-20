"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Visibility,
  VisibilityOff,
  ArrowForward
} from "@mui/icons-material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success && data.redirect) {
        window.location.href = data.redirect;
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 font-sans transition-colors duration-300">
      {/* LEFT SIDE - FORM */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-8 lg:px-20 relative z-10"
      >
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-2 uppercase">Welcome to</h2>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">
              VL-PROLAB
            </h1>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Username/Email</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:border-black dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 font-medium text-gray-800 dark:text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:border-black dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 font-medium text-gray-800 dark:text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black dark:bg-blue-600 text-white rounded-[2rem] font-bold text-lg hover:bg-gray-900 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200 dark:shadow-none mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowForward fontSize="small" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button
              onClick={() => router.push("/credits")}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-gray-300 dark:decoration-gray-600 hover:decoration-black dark:hover:decoration-white underline-offset-4"
            >
              View Credits
            </button>
            <p className="text-xs text-gray-300 dark:text-gray-600 font-medium">VL ProLab © 2025</p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - VISUAL */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-black">
        {/* Abstract Gradient Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-blue-900 to-black opacity-90"></div>

        <div className="relative z-10 m-auto text-center px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Empowering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Next-Gen Learning.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
              Access your dashboard to manage courses, content, and analytics in one seamless workflow.
            </p>
          </motion.div>
        </div>

        {/* Floating Elements Animation */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 bg-blue-500 rounded-full blur-[100px] opacity-40"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-20 w-48 h-48 bg-violet-600 rounded-full blur-[120px] opacity-40"
        />
      </div>
    </div>
  );
}
