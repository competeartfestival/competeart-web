import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { buscarEscolaAdmin, listarEscolasAdmin } from "../lib/api";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";

type InscricaoAdmin = {
  id: string;
  nome: string;
  limiteCoreografias: number;
  bailarinosCadastrados: number;
  coreografiasCadastradas: number;
  valorTotal: number;
  tipoInscricao: "ESCOLA" | "BAILARINO_INDEPENDENTE";
  status: "FALTA_ELENCO" | "FALTA_COREOGRAFIA" | "COMPLETO";
};

export default function Admin() {
  const navegar = useNavigate();

  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
  const [detalheInscricao, setDetalheInscricao] = useState<any>(null);
  const [inscricoes, setInscricoes] = useState<InscricaoAdmin[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [coreografiaSelecionada, setCoreografiaSelecionada] = useState<any>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) navegar("/admin/login");
  }, [navegar]);

  useEffect(() => {
    listarEscolasAdmin()
      .then((dados) => setInscricoes(dados || []))
      .finally(() => setCarregandoLista(false));
  }, []);

  async function abrirDetalhes(id: string) {
    setIdSelecionado(id);
    setCoreografiaSelecionada(null);

    const dados = await buscarEscolaAdmin(id);
    setDetalheInscricao(dados);
  }

  function fecharDetalhes() {
    setIdSelecionado(null);
    setDetalheInscricao(null);
    setCoreografiaSelecionada(null);
  }

  const tituloDetalhes =
    detalheInscricao?.escola?.nome || detalheInscricao?.independente?.nomeResponsavel;

  function obterTextoStatus(status: InscricaoAdmin["status"]) {
    if (status === "FALTA_ELENCO") return "FALTA ELENCO";
    if (status === "FALTA_COREOGRAFIA") return "FALTA COREOGRAFIA";
    return "COMPLETO";
  }

  function obterClasseStatus(status: InscricaoAdmin["status"]) {
    if (status === "COMPLETO") {
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
    }

    if (status === "FALTA_COREOGRAFIA") {
      return "border-amber-400/40 bg-amber-500/10 text-amber-100";
    }

    return "border-red-400/40 bg-red-500/10 text-red-100";
  }

  function gerarPathContinuacao(inscricao: InscricaoAdmin) {
    const prefixo =
      inscricao.tipoInscricao === "ESCOLA"
        ? `/inscricao/${inscricao.id}`
        : `/independentes/${inscricao.id}`;

    if (inscricao.status === "FALTA_ELENCO") return `${prefixo}/elenco`;
    if (inscricao.status === "FALTA_COREOGRAFIA") return `${prefixo}/coreografias`;
    return `${prefixo}/resumo`;
  }

  async function copiarLinkContinuacao(inscricao: InscricaoAdmin) {
    const link = `${window.location.origin}${gerarPathContinuacao(inscricao)}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      return;
    }

    setCopiadoId(inscricao.id);
    window.setTimeout(() => {
      setCopiadoId((atual) => (atual === inscricao.id ? null : atual));
    }, 1800);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white px-6 py-8 md:py-10">
      <FundoFestival variante="admin" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <HeaderSite />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-primary text-orange-500">Inscrições</h1>
          <p className="mt-2 text-sm text-gray-400">
            Acompanhe status, valores e detalhes de cada inscrição.
          </p>
        </div>

        {carregandoLista ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <>
            <div className="mb-8 text-sm text-gray-400">Total: {inscricoes.length}</div>

            <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/85 border-b border-zinc-800">
                  <tr className="text-xs uppercase tracking-[0.12em] text-gray-400">
                    <th className="px-4 py-3">Inscrição</th>
                    <th className="px-4 py-3">Bailarinos</th>
                    <th className="px-4 py-3">Coreografias</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {inscricoes.map((inscricao) => (
                    <tr key={inscricao.id} className="border-b border-zinc-900/80 last:border-b-0">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {inscricao.tipoInscricao === "ESCOLA" ? (
                            <span className="w-fit px-2 py-1 rounded text-[11px] bg-orange-500 text-black font-semibold">
                              ESCOLA
                            </span>
                          ) : (
                            <span className="w-fit px-2 py-1 rounded text-[11px] border border-orange-500 text-orange-400 bg-black font-semibold">
                              BAILARINO INDEPENDENTE
                            </span>
                          )}
                          <button
                            onClick={() => abrirDetalhes(inscricao.id)}
                            className="font-secondary text-base text-white hover:text-orange-300 text-left transition"
                          >
                            {inscricao.nome}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        {inscricao.bailarinosCadastrados}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        {inscricao.coreografiasCadastradas}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${obterClasseStatus(
                            inscricao.status,
                          )}`}
                        >
                          {obterTextoStatus(inscricao.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-orange-300">
                        R$ {inscricao.valorTotal}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => copiarLinkContinuacao(inscricao)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                              copiadoId === inscricao.id
                                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                                : "border-zinc-700 bg-zinc-900 text-gray-200 hover:border-orange-400/40 hover:text-white"
                            }`}
                          >
                            {copiadoId === inscricao.id ? <Check size={14} /> : <Copy size={14} />}
                            {copiadoId === inscricao.id ? "Copiado" : "Copiar link"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {inscricoes.map((inscricao) => (
                <div key={inscricao.id} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {inscricao.tipoInscricao === "ESCOLA" ? (
                        <span className="px-2 py-1 rounded text-[11px] bg-orange-500 text-black font-semibold">
                          ESCOLA
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-[11px] border border-orange-500 text-orange-400 bg-black font-semibold">
                          BAILARINO INDEPENDENTE
                        </span>
                      )}
                      <button
                        onClick={() => abrirDetalhes(inscricao.id)}
                        className="block mt-3 font-secondary text-base text-left hover:text-orange-300 transition"
                      >
                        {inscricao.nome}
                      </button>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${obterClasseStatus(
                        inscricao.status,
                      )}`}
                    >
                      {obterTextoStatus(inscricao.status)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-300">
                    <div className="rounded-lg bg-black/30 border border-zinc-800 px-2 py-2 text-center">
                      <p className="text-gray-500">Elenco</p>
                      <p className="mt-1 font-semibold">{inscricao.bailarinosCadastrados}</p>
                    </div>
                    <div className="rounded-lg bg-black/30 border border-zinc-800 px-2 py-2 text-center">
                      <p className="text-gray-500">Coreografias</p>
                      <p className="mt-1 font-semibold">{inscricao.coreografiasCadastradas}</p>
                    </div>
                    <div className="rounded-lg bg-black/30 border border-zinc-800 px-2 py-2 text-center">
                      <p className="text-gray-500">Valor</p>
                      <p className="mt-1 font-semibold text-orange-300">R$ {inscricao.valorTotal}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => copiarLinkContinuacao(inscricao)}
                    className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      copiadoId === inscricao.id
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                        : "border-zinc-700 bg-zinc-900 text-gray-200 hover:border-orange-400/40 hover:text-white"
                    }`}
                  >
                    {copiadoId === inscricao.id ? <Check size={15} /> : <Copy size={15} />}
                    {copiadoId === inscricao.id ? "Link copiado" : "Copiar link"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {idSelecionado && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={fecharDetalhes} />

          <div className="relative bg-zinc-950 rounded-t-2xl p-6 h-[92vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-primary text-orange-500">{tituloDetalhes}</h2>

                <button
                  onClick={fecharDetalhes}
                  className="px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  Fechar
                </button>
              </div>

              {!detalheInscricao ? (
                <p className="text-gray-400">Carregando...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-400 mb-6">Total: R$ {detalheInscricao.valores.total}</p>

                  {detalheInscricao.escola ? (
                    <div className="mb-6 space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Diretor:</span> {detalheInscricao.escola.nomeDiretor}
                      </p>
                      <p>
                        <span className="text-gray-500">WhatsApp:</span> {detalheInscricao.escola.whatsapp}
                      </p>
                      <p>
                        <span className="text-gray-500">Endereço:</span> {detalheInscricao.escola.endereco}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6 space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Responsável:</span>{" "}
                        {detalheInscricao.independente.nomeResponsavel}
                      </p>
                      <p>
                        <span className="text-gray-500">WhatsApp:</span> {detalheInscricao.independente.whatsapp}
                      </p>
                      <p>
                        <span className="text-gray-500">E-mail:</span> {detalheInscricao.independente.email}
                      </p>
                    </div>
                  )}

                  {!coreografiaSelecionada ? (
                    <>
                      <h3 className="font-secondary mb-4">Coreografias</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        {detalheInscricao.detalhamento.coreografias.map((coreografia: any) => (
                          <button
                            key={coreografia.id}
                            onClick={() => setCoreografiaSelecionada(coreografia)}
                            className="text-left p-4 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition"
                          >
                            <p className="font-medium text-lg">{coreografia.nome}</p>
                            <p className="text-sm text-gray-400">
                              {coreografia.formacao} • {coreografia.bailarinos} bailarinos
                            </p>
                            <p className="text-orange-500 font-semibold mt-2">R$ {coreografia.valor}</p>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setCoreografiaSelecionada(null)}
                        className="mb-6 text-sm text-orange-400 hover:underline"
                      >
                        ← Voltar para coreografias
                      </button>

                      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-primary text-orange-500">{coreografiaSelecionada.nome}</h3>

                          <div className="text-sm text-gray-300 space-y-2">
                            <p>
                              <span className="text-gray-500">Formação:</span> {coreografiaSelecionada.formacao}
                            </p>
                            <p>
                              <span className="text-gray-500">Modalidade:</span> {coreografiaSelecionada.modalidade}
                            </p>
                            <p>
                              <span className="text-gray-500">Categoria:</span> {coreografiaSelecionada.categoria}
                            </p>
                            <p>
                              <span className="text-gray-500">Duração:</span> {coreografiaSelecionada.duracao}
                            </p>
                            <p>
                              <span className="text-gray-500">Música:</span> {coreografiaSelecionada.musica}
                            </p>
                            <p>
                              <span className="text-gray-500">Tem cenário:</span>{" "}
                              {coreografiaSelecionada.temCenario ? "Sim" : "Não"}
                            </p>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-secondary mb-3">Bailarinos</h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {coreografiaSelecionada.listaBailarinos?.map((bailarino: any) => (
                                <div key={bailarino.id} className="bg-zinc-900 p-3 rounded border border-zinc-800">
                                  {bailarino.nomeArtistico || bailarino.nomeCompleto}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 h-fit">
                          <p className="text-xs text-gray-400">Valor da coreografia</p>
                          <p className="text-orange-500 font-bold text-3xl mt-2">R$ {coreografiaSelecionada.valor}</p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
