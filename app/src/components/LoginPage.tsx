import React, { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { supabase } from "../supabase";

export const LoginPage: React.FC = () => {
  const { loginAsUser, navigateTo } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // We log them in using the app context if needed or it's handled by onAuthStateChange in AppContext
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };

  return (
    <motion.div
      key="login-page"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center bg-[#3b2416] relative overflow-hidden font-sans"
    >
      {/* Decorative gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 top-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,90,43,0.1) 0%, transparent 70%)",
        }}
      ></div>
      <div className="absolute -left-[10%] top-[20%] w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -right-[10%] bottom-[10%] w-96 h-96 bg-leather/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative w-full max-w-md flex flex-col items-center">
        {/* Header (Logo + Title) */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-2 border-2 border-white/10 rounded-full bg-white/5 backdrop-blur-sm self-center">
              <img
                src="https://res.cloudinary.com/domuelr1f/image/upload/v1781330047/WhatsApp_Image_2026-06-06_at_8.18.23_PM_1_a7mhk6.jpg"
                alt="YY Leathers Logo"
                className="w-16 h-16 object-cover rounded-full"
              />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
            YY <span className="text-gold">Leathers</span>
          </h1>
          <p className="text-white/60 text-sm tracking-widest uppercase">
            Premium Leather Marketplace
          </p>
        </div>

        {/* Login Box */}
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden shadow-black/20 text-neutral-800 p-8">
          {/* Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-full mb-8">
            <button
              className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-all ${!isSignUp ? "bg-[#8B5A2B] text-white shadow-md" : "text-neutral-500 hover:text-neutral-700"}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-all ${isSignUp ? "bg-[#8B5A2B] text-white shadow-md" : "text-neutral-500 hover:text-neutral-700"}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-leather-dark">
              {isSignUp ? "Create Account! ✨" : "Welcome Back! 🙏"}
            </h2>
            <p className="text-xs font-medium text-neutral-500 mt-1 uppercase tracking-wide">
              {isSignUp
                ? "Join our exclusive patronage"
                : "Login to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center">
                {errorMsg}
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] pl-1">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required={isSignUp}
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pt-3 pb-3 pr-4 border border-neutral-200 rounded-xl text-sm focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pt-3 pb-3 pr-4 border border-neutral-200 rounded-xl text-sm focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pt-3 pb-3 pr-4 border border-neutral-200 rounded-xl text-sm focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none transition-all"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  className="text-xs font-semibold text-gold hover:text-leather transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-leather to-[#633a17] hover:from-leather-dark hover:to-leather text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-xl mt-4 disabled:opacity-75"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Sign Up" : "Sign In"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Split */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="px-3 bg-white text-neutral-400">
                or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-6 flex items-center justify-center gap-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-4 h-4"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] text-white/50 uppercase tracking-widest">
          © 2026 YY Leathers · Chennai, Tamil Nadu
        </div>
      </div>
    </motion.div>
  );
};

