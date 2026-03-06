import { useParams, useNavigate, useLocation } from "react-router-dom";
import CoreografiaForm from "../components/forms/CoreografiaForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function CoreografiasIndependente() {
  const { independenteId } = useParams();
  const navegar = useNavigate();
  const location = useLocation();

  if (!independenteId) return null;

  return (
    <PaginaComVoltar
      titulo="Cadastro de Coreografias"
      subtitulo="Cadastre todas as coreografias planejadas. A confirmação da inscrição só será liberada quando atingir o total informado."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
      etapas={[
        { id: "tipo", titulo: "Tipo" },
        { id: "dados", titulo: "Dados" },
        { id: "elenco", titulo: "Elenco" },
        { id: "coreografias", titulo: "Coreografias" },
        { id: "resumo", titulo: "Confirmação" },
      ]}
      etapaAtualId="coreografias"
    >
      {typeof location.state?.aviso === "string" && (
        <div className="mb-4 rounded-lg border border-amber-300/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          {location.state.aviso}
        </div>
      )}
      <CoreografiaForm inscricaoId={independenteId} tipoInscricao="independente" />
    </PaginaComVoltar>
  );
}
