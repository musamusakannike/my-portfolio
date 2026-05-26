"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaTimes } from "react-icons/fa";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleNativeSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (isLogin) {
        setMessage("Success! Logging in...");
        setTimeout(() => {
          onAuthSuccess(data.user);
          onClose();
        }, 1500);
      } else {
        setMessage("Account created! Please check your email inbox to verify your account.");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // 1. Sign in with Google using Firebase Popup
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 2. Send ID token to our API to authorize session
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Google authentication failed");
      }

      setMessage("Success! Syncing Google account...");
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#000]/80 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative z-10 w-full max-w-md border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl rounded-none font-mono"
        >
          {/* Scanline overlay */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-5" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
          >
            <FaTimes size={18} />
          </button>

          {/* Title header */}
          <div className="mb-8 border-b border-white/10 pb-4 text-center">
            <h3 className="text-xl font-bold text-white tracking-tighter uppercase">
              CODIAC // {isLogin ? "USER LOGIN" : "CREATE ACCOUNT"}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 uppercase">
              {isLogin ? "Access technical journals & dashboard" : "Join the developer network"}
            </p>
          </div>

          {/* Error / Success logs */}
          {error && (
            <div className="mb-4 border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              [ERROR]: {error}
            </div>
          )}
          {message && (
            <div className="mb-4 border border-[var(--color-toxic-green)]/20 bg-[var(--color-toxic-green)]/10 p-3 text-xs text-[var(--color-toxic-green)]">
              [LOG]: {message}
            </div>
          )}

          {/* Core Form */}
          <form onSubmit={handleNativeSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-neutral-500">
                  <FaUser size={14} />
                </span>
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-white/10 bg-black py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 rounded-none focus:border-[var(--color-toxic-green)] focus:outline-none"
                />
              </div>
            )}

            <div className="relative">
              <span className="absolute left-3 top-3.5 text-neutral-500">
                <FaEnvelope size={14} />
              </span>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-white/10 bg-black py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 rounded-none focus:border-[var(--color-toxic-green)] focus:outline-none"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3.5 text-neutral-500">
                <FaLock size={14} />
              </span>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-white/10 bg-black py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 rounded-none focus:border-[var(--color-toxic-green)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-[var(--color-toxic-green)] text-black font-bold py-3 text-sm tracking-widest uppercase transition-colors rounded-none disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : isLogin ? "LOG IN" : "SIGN UP"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="my-6 flex items-center justify-between text-xs text-neutral-600">
            <span className="h-px w-1/3 bg-white/5" />
            <span className="uppercase">OR USE</span>
            <span className="h-px w-1/3 bg-white/5" />
          </div>

          {/* Google SSO Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 border border-white/10 bg-black hover:bg-neutral-900 py-3 text-xs tracking-wider text-white uppercase transition-colors rounded-none disabled:opacity-50"
          >
            <FaGoogle className="text-red-500" />
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          {/* Switch action */}
          <div className="mt-8 text-center text-xs text-neutral-400">
            {isLogin ? "NEW VISITOR? " : "ALREADY REGISTERED? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
              }}
              className="text-[var(--color-toxic-green)] hover:underline uppercase"
            >
              {isLogin ? "create account" : "log in now"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
