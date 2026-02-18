import { useNavigate } from "react-router-dom";

export default function Inscricao() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white mb-6"
      >
        ← Voltar
      </button>

      <h1 className="font-primary text-2xl text-orange-500 mb-2 text-left">
        Tipo de Inscrição
      </h1>
      <p className="text-gray-400 mb-8">Escolha como deseja se inscrever.</p>

      <div className="max-w-md mx-auto flex flex-col gap-4">
        <button
          onClick={() => navigate("/inscricao/escola")}
          className="px-6 py-4 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 transition"
        >
          Escola
        </button>

        <button
          onClick={() => navigate("/inscricao/independente")}
          className="px-6 py-4 rounded-lg border border-orange-500 text-orange-400 font-medium hover:bg-orange-500 hover:text-black transition"
        >
          Bailarino Independente
        </button>
      </div>
    </main>
  );
}
