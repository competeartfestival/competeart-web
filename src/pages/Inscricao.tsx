import { useNavigate } from "react-router-dom";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function Inscricao() {
  const navegar = useNavigate();

  return (
    <PaginaComVoltar
      titulo="Tipo de Inscrição"
      subtitulo="Escolha como deseja se inscrever."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-3xl"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => navegar("/inscricao/escola")}
          className="px-6 py-5 rounded-lg bg-orange-500 text-black font-semibold hover:bg-orange-600 transition"
        >
          Escola
        </button>

        <button
          onClick={() => navegar("/inscricao/independente")}
          className="px-6 py-5 rounded-lg border border-orange-500 text-orange-400 font-semibold hover:bg-orange-500 hover:text-black transition"
        >
          Bailarino Independente
        </button>
      </div>
    </PaginaComVoltar>
  );
}
