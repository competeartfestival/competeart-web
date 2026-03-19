import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obterResumo } from "../lib/api";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";
import { WHATSAPP_CONTATO_WA_ME } from "../lib/whatsapp";

export default function Resumo() {
  const { escolaId } = useParams();
  const navegar = useNavigate();

  const [resumo, setResumo] = useState<any>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [avancando, setAvancando] = useState(false);

  useEffect(() => {
    if (!escolaId) return;
    obterResumo(escolaId).then(setResumo);
  }, [escolaId]);

  const faltam =
    resumo?.escola?.limiteCoreografias != null
      ? resumo.escola.limiteCoreografias - resumo.totais.coreografias
      : 0;

  useEffect(() => {
    if (!resumo) return;
    if (faltam > 0) {
      navegar(`/inscricao/${resumo.escola.id}/coreografias`, {
        replace: true,
        state: {
          aviso:
            "Para chegar na confirmação, é obrigatório cadastrar todas as coreografias.",
        },
      });
    }
  }, [resumo, faltam, navegar]);

  if (!resumo) {
    return <main className="min-h-screen bg-black text-white p-6">Carregando resumo...</main>;
  }

  if (faltam > 0) return null;

  const cadastroCompleto = faltam <= 0;
  const valorProfissionaisExtras =
    resumo.valores.profissionaisExtras ?? resumo.valores.assistentesExtras;
  const linkWhatsapp =
    `https://wa.me/${WHATSAPP_CONTATO_WA_ME}?text=` +
    encodeURIComponent(
      "Olá, represento a escola " +
        resumo.escola.nome +
        " e gostaria de confirmar minha inscrição com o valor de R$" +
        resumo.valores.total +
        " no festival Compete’Art",
    );

  function irParaCoreografias() {
    if (avancando) return;
    setAvancando(true);
    navegar(`/inscricao/${resumo.escola.id}/coreografias`);
  }

  return (
    <PaginaComVoltar
      titulo="Confirmação da Inscrição"
      subtitulo="Cadastro completo. Confira os valores e finalize sua confirmação pelo WhatsApp."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
      etapas={[
        { id: "tipo", titulo: "Tipo" },
        { id: "dados", titulo: "Dados" },
        { id: "elenco", titulo: "Elenco" },
        { id: "coreografias", titulo: "Coreografias" },
        { id: "resumo", titulo: "Confirmação" },
      ]}
      etapaAtualId="resumo"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8">
        <section>
          <div className="mb-6">
            <h2 className="font-secondary font-semibold mb-2">Escola</h2>
            <p>{resumo.escola.nome}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-secondary font-semibold mb-2">Coreografias</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {resumo.detalhamento.coreografias.map((coreografia: any) => (
                <li key={coreografia.id} className="p-4 rounded bg-zinc-900">
                  <p className="font-medium">{coreografia.nome}</p>
                  <p className="text-sm text-gray-400">{coreografia.formacao}</p>
                  <p className="text-orange-500 font-semibold">R$ {coreografia.valor}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 h-fit">
          <div
            className={`mb-4 rounded-lg border p-3 ${
              cadastroCompleto
                ? "border-orange-300/35 bg-orange-500/10"
                : "border-amber-300/30 bg-amber-500/10"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.14em] text-gray-300">
              {cadastroCompleto ? "Passo final obrigatório" : "Próximo passo obrigatório"}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {cadastroCompleto
                ? "Quase lá! Falta confirmar no WhatsApp."
                : `Faltam ${faltam} coreografia${faltam > 1 ? "s" : ""} para concluir.`}
            </p>
            <p className="mt-1 text-xs text-gray-200 leading-relaxed">
              {cadastroCompleto
                ? "Para finalizar sua inscrição, clique no botão abaixo e envie a mensagem de confirmação no WhatsApp."
                : "Complete o cadastro das coreografias para liberar a confirmação final no WhatsApp."}
            </p>
          </div>

          <h2 className="font-secondary font-semibold mb-3">Totais</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Coreografias</span>
            <span>R$ {resumo.valores.coreografias}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Profissionais extras</span>
            <span>R$ {valorProfissionaisExtras}</span>
          </div>

          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-zinc-700">
            <span>Total</span>
            <span className="text-orange-500">R$ {resumo.valores.total}</span>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            O pagamento será realizado fora da plataforma. Confirme sua inscrição pelo WhatsApp.
          </p>

          {!cadastroCompleto ? (
            <button
              onClick={irParaCoreografias}
              disabled={avancando}
              className="mt-6 w-full px-6 py-3 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {avancando
                ? "Avançando..."
                : `Adicionar coreografia (${faltam} restante${faltam > 1 ? "s" : ""})`}
            </button>
          ) : (
            <a
              href={linkWhatsapp}
              onClick={() => setConfirmando(true)}
              className="mt-6 w-full px-6 py-3 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 flex justify-center items-center no-underline transition"
              style={{
                pointerEvents: confirmando ? "none" : "auto",
                opacity: confirmando ? 0.6 : 1,
                cursor: confirmando ? "not-allowed" : "pointer",
              }}
            >
              <span className="font-extralight flex items-center">
                <img className="w-auto h-5 mr-2" src="/assets/whatsapp.png" />
                {confirmando
                  ? "Concluindo..."
                  : "Confirmar minha inscrição no WhatsApp"}
              </span>
            </a>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Etapa final obrigatória: confirmação da inscrição via WhatsApp.
          </p>
        </aside>
      </div>
    </PaginaComVoltar>
  );
}
