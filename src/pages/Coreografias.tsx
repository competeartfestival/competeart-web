import { useParams, useNavigate } from "react-router-dom";
import CoreografiaForm from "../components/forms/CoreografiaForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function Coreografias() {
  const { escolaId } = useParams();
  const navegar = useNavigate();

  if (!escolaId) return null;

  return (
    <PaginaComVoltar
      titulo="Cadastro de Coreografias"
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
    >
      <CoreografiaForm inscricaoId={escolaId} tipoInscricao="escola" />
    </PaginaComVoltar>
  );
}
