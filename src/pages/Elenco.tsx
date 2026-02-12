import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BailarinoForm from "../components/forms/BailarinoForm";
import { listarBailarinos } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Elenco() {
  const { escolaId } = useParams();
  const [bailarinos, setBailarinos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!escolaId) return;

    listarBailarinos(escolaId)
      .then(setBailarinos)
      .finally(() => setLoading(false));
  }, [escolaId]);

  if (!escolaId) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="font-primary text-3xl text-orange-500 mb-6">
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
          {bailarinos.map((b) => (
            <li key={b.id} className="px-4 py-2 rounded bg-zinc-900 text-sm">
              {b.nomeArtistico || b.nomeCompleto}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => navigate(`/inscricao/${escolaId}/coreografias`)}
        className="
    mt-10
    px-6 py-3
    rounded-lg
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
