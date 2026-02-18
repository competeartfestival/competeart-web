import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BailarinoForm from "../components/forms/BailarinoForm";
import { listarBailarinos } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Elenco() {
  const { escolaId } = useParams();
  const [bailarinos, setBailarinos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!escolaId) return;

    listarBailarinos(escolaId)
      .then(setBailarinos)
      .finally(() => setLoading(false));
  }, [escolaId]);

  function handleAvancar() {
    if (bailarinos.length === 0) {
      setToast(
        "Você vai precisar de ao menos um bailarino para cadastrar uma coreografia.",
      );

      setTimeout(() => {
        setToast(null);
      }, 8000);

      return;
    }

    navigate(`/inscricao/${escolaId}/coreografias`);
  }

  if (!escolaId) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 pb-24">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-4/5">
          <div className="px-6 py-3 rounded-lg bg-zinc-900 border border-orange-500 text-sm text-orange-400 shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white mb-6"
      >
        ← Voltar
      </button>

      <h1 className="font-primary text-2xl text-orange-500 mb-6">
        Cadastro do Elenco
      </h1>

      <BailarinoForm
        escolaId={escolaId}
        onNovoBailarino={(bailarino) =>
          setBailarinos((prev) => [...prev, bailarino])
        }
      />

      {loading ? (
        <p className="mt-6 text-gray-400">Carregando bailarinos...</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          <p className="my-2">Seus bailarinos:</p>
          {bailarinos.map((b) => (
            <li key={b.id} className="px-4 py-2 rounded bg-zinc-900 text-sm">
              {b.nomeArtistico || b.nomeCompleto}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleAvancar}
        className="
          mt-10
          px-6 py-3
          fixed
          left-0
          bottom-0
          w-full
          bg-orange-500
          text-black
          font-medium
          hover:bg-orange-600
        "
      >
        Avançar para Coreografias
      </button>
    </main>
  );
}
