import EscolaForm from "../components/forms/EscolaForm";
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

      <h1 className="font-primary text-2xl text-orange-500 mb-6 text-center">
        Cadastro da Escola
      </h1>

      <EscolaForm />
    </main>
  );
}
