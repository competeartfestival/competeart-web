import { useNavigate } from "react-router-dom";
import IndependenteForm from "../components/forms/IndependenteForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function InscricaoIndependente() {
  const navegar = useNavigate();

  return (
    <PaginaComVoltar
      titulo="Cadastro de Bailarino Independente"
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-4xl"
    >
      <IndependenteForm />
    </PaginaComVoltar>
  );
}
