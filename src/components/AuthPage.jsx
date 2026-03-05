import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState("auth"); // "auth" | "success"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
    const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                // Trigger success animation
                setReverseCanvasVisible(true);
                setTimeout(() => setInitialCanvasVisible(false), 50);
                setTimeout(() => setStep("success"), 1500);
            }
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                setMessage("Account created! Signing you in...");
                // Auto sign-in after signup
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) {
                    setMessage("Account created! Please sign in.");
                    setIsLogin(true);
                    setLoading(false);
                } else {
                    setReverseCanvasVisible(true);
                    setTimeout(() => setInitialCanvasVisible(false), 50);
                    setTimeout(() => setStep("success"), 1500);
                }
            }
        }
    }

    return (
        <div className="flex w-full flex-col min-h-screen bg-black relative">
            {/* ── Canvas Background ─────────────────────── */}
            <div className="absolute inset-0 z-0">
                {initialCanvasVisible && (
                    <div className="absolute inset-0">
                        <CanvasRevealEffect
                            animationSpeed={3}
                            containerClassName="bg-black"
                            colors={[[255, 255, 255], [255, 255, 255]]}
                            dotSize={6}
                            reverse={false}
                        />
                    </div>
                )}
                {reverseCanvasVisible && (
                    <div className="absolute inset-0">
                        <CanvasRevealEffect
                            animationSpeed={4}
                            containerClassName="bg-black"
                            colors={[[255, 255, 255], [255, 255, 255]]}
                            dotSize={6}
                            reverse={true}
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
            </div>

            {/* ── Content ───────────────────────────────── */}
            <div className="relative z-10 flex flex-col flex-1">
                {/* Top Nav */}
                <header className="fixed top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8 px-6 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="relative w-5 h-5 flex items-center justify-center">
                        <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 -translate-x-1/2 opacity-80" />
                        <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 -translate-y-1/2 opacity-80" />
                        <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 -translate-y-1/2 opacity-80" />
                        <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 -translate-x-1/2 opacity-80" />
                    </div>
                    <nav className="hidden sm:flex items-center gap-6 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Docs</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
                            className={`px-4 py-1.5 text-xs sm:text-sm rounded-full border transition-all ${isLogin
                                ? 'border-white/30 bg-white/10 text-white'
                                : 'border-white/10 bg-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Login
                        </button>
                        <div className="relative group">
                            <div className="absolute inset-0 -m-1 rounded-full bg-white/30 blur-md opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none hidden sm:block" />
                            <button
                                onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
                                className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${!isLogin
                                    ? 'bg-white text-black'
                                    : 'bg-gradient-to-br from-gray-100 to-gray-300 text-black hover:from-white hover:to-gray-200'
                                    }`}
                            >
                                Signup
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Form */}
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="w-full max-w-sm mt-20">
                        <AnimatePresence mode="wait">
                            {step === "auth" ? (
                                <motion.div
                                    key="auth-step"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="space-y-6 text-center"
                                >
                                    <div className="space-y-2">
                                        <h1 className="text-4xl sm:text-[2.5rem] font-bold leading-tight tracking-tight text-white">
                                            {isLogin ? "Welcome Back" : "Join SleepGuard"}
                                        </h1>
                                        <p className="text-lg sm:text-xl text-white/50 font-light">
                                            {isLogin ? "Sign in to your dashboard" : "Create your account"}
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-medium text-white/40 mb-2 ml-1 uppercase tracking-wider">Email</label>
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full backdrop-blur-sm text-white bg-white/5 border border-white/10 rounded-full py-3.5 px-5 focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-xs font-medium text-white/40 mb-2 ml-1 uppercase tracking-wider">Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="w-full backdrop-blur-sm text-white bg-white/5 border border-white/10 rounded-full py-3.5 px-5 focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                            />
                                        </div>

                                        {/* Error / Message */}
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="py-2 px-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                            >
                                                {error}
                                            </motion.div>
                                        )}
                                        {message && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="py-2 px-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                                            >
                                                {message}
                                            </motion.div>
                                        )}

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full rounded-full font-semibold py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-white/90"
                                            whileHover={!loading ? { scale: 1.02 } : {}}
                                            whileTap={!loading ? { scale: 0.98 } : {}}
                                        >
                                            {loading ? "..." : isLogin ? "Sign In" : "Create Account"}
                                        </motion.button>
                                    </form>

                                    {/* Divider */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-px bg-white/10 flex-1" />
                                        <span className="text-white/30 text-xs">IOT SLEEP MONITOR</span>
                                        <div className="h-px bg-white/10 flex-1" />
                                    </div>

                                    {/* Toggle */}
                                    <p className="text-xs text-white/40 pt-2">
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <span
                                            onClick={() => {
                                                setIsLogin(!isLogin);
                                                setError("");
                                                setMessage("");
                                            }}
                                            className="text-white/60 hover:text-white cursor-pointer underline transition-colors"
                                        >
                                            {isLogin ? "Sign up" : "Sign in"}
                                        </span>
                                    </p>

                                    <p className="text-[10px] text-white/25 pt-6 leading-relaxed">
                                        SleepGuard — Smart Sleep Monitoring System
                                        <br />
                                        Real-time IoT posture, SPO2 & environment tracking
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success-step"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                                    className="space-y-6 text-center"
                                >
                                    <div className="space-y-2">
                                        <h1 className="text-4xl font-bold tracking-tight text-white">You're in!</h1>
                                        <p className="text-lg text-white/50 font-light">Welcome to SleepGuard</p>
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="py-10"
                                    >
                                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                        className="text-white/40 text-sm"
                                    >
                                        Redirecting to dashboard...
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
