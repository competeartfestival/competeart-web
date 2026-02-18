import { useNavigate } from "react-router-dom";
import IndependenteForm from "../components/forms/IndependenteForm";

export default function InscricaoIndependente() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white mb-6"
      >
        ← Voltar
      </button>

      <h1 className="font-primary text-2xl text-orange-500 mb-6 text-left">
        Cadastro de Bailarino Independente
      </h1>

      <IndependenteForm />
    </main>
  );
}
