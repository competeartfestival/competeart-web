import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarAdmin } from "../lib/api";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!token.trim()) return;

    setErro("");
    setLoading(true);

    try {
      const valido = await validarAdmin(token);

      if (!valido) {
        setErro("Chave administrativa inválida.");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin-token", token);
      navigate("/admin");
    } catch {
      setErro("Erro ao validar chave. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen text-white flex items-center justify-center px-8 overflow-hidden">
      {/* Background image */}
      <div
        className="
          absolute inset-0
          bg-[url('/assets/adminbg.jpg')]
          bg-cover bg-center
          grayscale
          opacity-40
        "
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo */}
      <div className="relative w-full max-w-sm flex flex-col gap-6 z-10">
        <div className="flex flex-col items-center text-center gap-6">
          <img
            src="/assets/logo.png"
            alt="Compete'Art"
            className="w-32 md:w-56 lg:w-64 drop-shadow-lg"
          />
        </div>

        <input
          type="password"
          placeholder="Chave administrativa"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="
            px-4 py-3 rounded 
            bg-zinc-900/80 backdrop-blur-sm 
            text-white 
            focus:outline-none 
            focus:ring-2 
            focus:ring-orange-500
          "
        />

        {erro && <p className="text-sm text-red-400 text-center">{erro}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            px-6 py-3 rounded-lg
            bg-orange-500
            text-black
            font-medium
            transition-all
            hover:bg-orange-600
            disabled:opacity-60
          "
        >
          {loading ? "Validando..." : "Entrar"}
        </button>
      </div>
    </main>
  );
}
