import { useNavigate } from "react-router-dom";
import EscolaForm from "../components/forms/EscolaForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function InscricaoEscola() {
  const navegar = useNavigate();

  return (
    <PaginaComVoltar
      titulo="Cadastro da Escola"
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
    >
      <EscolaForm />
    </PaginaComVoltar>
  );
}
