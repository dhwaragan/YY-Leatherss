import React, { useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../supabase";
import { useApp } from "../context/AppContext";

export const LoginPage: React.FC = () => {
  const { loginAsUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setEmailLoading(true);
    setErrorMsg("");
    try {
      const ok = await loginAsUser(emailInput.trim());
      if (!ok) {
        setErrorMsg("Failed to sign in with this email. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in");
    } finally {
      setEmailLoading(false);
    }
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
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-leather-dark">
              Welcome to YY Leathers
            </h2>
            <p className="text-xs font-medium text-neutral-500 mt-1 uppercase tracking-wide">
              Sign in to continue
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center mb-4">
              {errorMsg}
            </div>
          )}

          {/* Email Sign-In (Testing Mode) */}
          <form onSubmit={handleEmailSignIn} className="mb-5">
            <div className="flex items-center gap-2 bg-neutral-50 border-2 border-neutral-200 rounded-xl p-1 focus-within:border-gold transition-colors">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email to sign in"
                required
                className="flex-1 bg-transparent px-3 py-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none"
              />
              <button
                type="submit"
                disabled={emailLoading || !emailInput.trim()}
                className="bg-leather hover:bg-gold text-white font-bold px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {emailLoading ? "Signing..." : "Sign In"}
              </button>
            </div>
            <p className="text-[9px] text-neutral-400 mt-2 text-center">Testing mode: Just enter any email to sign in instantly</p>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-neutral-200 hover:border-gold hover:bg-neutral-50 text-neutral-700 py-4 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-75"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-5 h-5"
              alt="Google"
            />
            <span className="font-bold">Continue with Google</span>
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] text-white/50 uppercase tracking-widest">
          © 2026 YY Leathers · Chennai, Tamil Nadu
        </div>
      </div>
    </motion.div>
  );
};

