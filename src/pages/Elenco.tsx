import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BailarinoForm from "../components/forms/BailarinoForm";
import { listarBailarinos } from "../lib/api";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";
import ToastAviso from "../components/ui/ToastAviso";
import ListaBailarinos from "../components/inscricao/ListaBailarinos";

export default function Elenco() {
  const { escolaId } = useParams();
  const navegar = useNavigate();

  const [bailarinos, setBailarinos] = useState<any[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [mensagemAviso, setMensagemAviso] = useState<string | null>(null);
  const [avancando, setAvancando] = useState(false);

  useEffect(() => {
    if (!escolaId) return;

    listarBailarinos(escolaId)
      .then(setBailarinos)
      .finally(() => setCarregandoLista(false));
  }, [escolaId]);

  function avancarParaCoreografias() {
    if (avancando) return;

    if (bailarinos.length === 0) {
      setMensagemAviso(
        "Você precisa cadastrar ao menos um bailarino para avançar para coreografias.",
      );

      setTimeout(() => {
        setMensagemAviso(null);
      }, 8000);

      return;
    }

    setAvancando(true);
    navegar(`/inscricao/${escolaId}/coreografias`);
  }

  if (!escolaId) return null;

  return (
    <PaginaComVoltar
      titulo="Cadastro do Elenco"
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
    >
      {mensagemAviso && <ToastAviso mensagem={mensagemAviso} />}

      <div className="grid lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] gap-8 items-start">
        <BailarinoForm
          inscricaoId={escolaId}
          tipoInscricao="escola"
          aoCadastrarBailarino={(bailarino) =>
            setBailarinos((listaAtual) => [...listaAtual, bailarino])
          }
        />

        <div>
          <ListaBailarinos bailarinos={bailarinos} carregando={carregandoLista} />

          <button
            onClick={avancarParaCoreografias}
            disabled={avancando}
            className="mt-8 px-6 py-3 w-full bg-orange-500 text-black font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {avancando ? "Avançando..." : "Avançar para Coreografias"}
          </button>
        </div>
      </div>
    </PaginaComVoltar>
  );
}
