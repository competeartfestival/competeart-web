import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarAdmin } from "../lib/api";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [validando, setValidando] = useState(false);
  const navegar = useNavigate();

  async function validarAcesso() {
    if (!token.trim() || validando) return;

    setMensagemErro("");
    setValidando(true);

    try {
      const chaveValida = await validarAdmin(token);

      if (!chaveValida) {
        setMensagemErro("Chave administrativa inválida.");
        setValidando(false);
        return;
      }

      localStorage.setItem("admin-token", token);
      navegar("/admin");
    } catch {
      setMensagemErro("Erro ao validar chave. Tente novamente.");
    } finally {
      setValidando(false);
    }
  }

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <FundoFestival variante="admin" />

      <div className="relative z-10 px-6 py-6 md:px-10 md:py-8">
        <div className="max-w-6xl mx-auto">
          <HeaderSite sobreFundo />
        </div>
      </div>

      <div className="relative z-10 min-h-[calc(100vh-6rem)] px-6 md:px-10 flex items-center justify-center">
        <div className="w-full max-w-md flex flex-col gap-6 rounded-2xl border border-zinc-700 bg-zinc-950/78 backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <img
              src="/assets/logo.png"
              alt="Compete'Art"
              className="w-36 md:w-52 lg:w-60 drop-shadow-lg"
            />
          </div>

          <input
            type="password"
            placeholder="Chave administrativa"
            value={token}
            onChange={(evento) => setToken(evento.target.value)}
            className="px-4 py-3 rounded bg-zinc-900/80 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {mensagemErro && <p className="text-sm text-red-400 text-center">{mensagemErro}</p>}

          <button
            onClick={validarAcesso}
            disabled={validando}
            className="px-6 py-3 rounded-lg bg-orange-500 text-black font-medium transition-all hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {validando ? "Validando..." : "Entrar"}
          </button>
        </div>
      </div>
    </main>
  );
}
