import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BailarinoForm from "../components/forms/BailarinoForm";
import { listarBailarinosIndependente } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ElencoIndependente() {
  const { independenteId } = useParams();
  const [bailarinos, setBailarinos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!independenteId) return;

    listarBailarinosIndependente(independenteId)
      .then(setBailarinos)
      .finally(() => setLoading(false));
  }, [independenteId]);

  function handleAvancar() {
    if (isAdvancing) return;

    if (bailarinos.length === 0) {
      setToast(
        "Voce vai precisar de ao menos um bailarino para cadastrar uma coreografia.",
      );

      setTimeout(() => {
        setToast(null);
      }, 8000);

      return;
    }

    setIsAdvancing(true);
    navigate(`/independentes/${independenteId}/coreografias`);
  }

  if (!independenteId) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 pb-24">
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowInfoModal(false)}
          />

          <div className="relative w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="text-xl font-primary text-orange-500 mb-3">
              Antes de continuar
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Nesta etapa, cadastre todos os bailarinos que vao participar das
              coreografias. Se a apresentacao for solo, cadastre apenas voce.
              Se houver mais participantes, cadastre cada um deles tambem.
            </p>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full px-4 py-3 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 transition"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

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
        inscricaoId={independenteId}
        tipoInscricao="independente"
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
        disabled={isAdvancing}
        className="mt-10 px-6 py-3 w-full bg-orange-500 text-black font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isAdvancing ? "Avancando..." : "Avancar para Coreografias"}
      </button>
    </main>
  );
}
