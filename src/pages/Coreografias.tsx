import { useParams, useNavigate } from "react-router-dom";
import CoreografiaForm from "../components/forms/CoreografiaForm";

export default function Coreografias() {
  const { escolaId } = useParams();

  const navigate = useNavigate();
  if (!escolaId) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white mb-6"
      >
        ← Voltar
      </button>
      <h1 className="font-primary text-3xl text-orange-500 mb-4">
        Cadastro de Coreografias
      </h1>

      {escolaId && <CoreografiaForm escolaId={escolaId} />}
    </main>
  );
}
