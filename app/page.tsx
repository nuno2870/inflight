"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabase"; // Importa a conexão que acabámos de criar

export default function LoginPage() {
  const router = useRouter();
  
  const [view, setView] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 1. Pedir ao Supabase para fazer login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message); // Ex: "Password errada"
      setLoading(false);
    } else {
      router.push("/dashboard"); // Sucesso! Entra no cockpit
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 2. Pedir ao Supabase para criar conta
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      alert("Conta criada! Verifica o teu email para confirmar (ou faz login se o email confirm não estiver ativo).");
      setView("login");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black">
      
      <div className="mb-8 text-center animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-white tracking-tight">
            InFlight
        </h1>
        <p className="text-gray-500 mt-2">Área Restrita</p>
      </div>

      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-3xl shadow-2xl">
        
        {/* --- MODO LOGIN --- */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Bem-vindo de volta</h2>
            
            {errorMsg && (
              <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm">
                ⚠️ {errorMsg}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input 
                type="email" required 
                className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-600 focus:outline-none transition"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Palavra-passe</label>
              <input 
                type="password" required 
                className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-600 focus:outline-none transition"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-bold py-3 rounded-xl transition flex justify-center">
              {loading ? "A entrar..." : "Entrar"}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Não tens conta? <button type="button" onClick={() => { setView("register"); setErrorMsg(""); }} className="text-blue-400 hover:underline">Regista-te</button>
            </p>
          </form>
        )}

        {/* --- MODO REGISTO --- */}
        {view === "register" && (
          <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Criar Conta</h2>
            
            {errorMsg && (
              <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm">
                ⚠️ {errorMsg}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input 
                type="email" required 
                className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-600 focus:outline-none transition"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Definir Palavra-passe</label>
              <input 
                type="password" required minLength={6}
                className="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-blue-600 focus:outline-none transition"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-white hover:bg-gray-200 disabled:bg-gray-500 text-black font-bold py-3 rounded-xl transition flex justify-center">
              {loading ? "A criar conta..." : "Criar Conta"}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Já tens conta? <button type="button" onClick={() => { setView("login"); setErrorMsg(""); }} className="text-blue-400 hover:underline">Entrar</button>
            </p>
          </form>
        )}

      </div>
    </main>
  );
}