import { useEffect, useState } from "react";
import { listarEscolasAdmin, buscarEscolaAdmin } from "../lib/api";
import { useNavigate } from "react-router-dom";

type InscricaoAdmin = {
  id: string;
  nome: string;
  limiteCoreografias: number;
  coreografiasCadastradas: number;
  valorTotal: number;
  tipoInscricao: "ESCOLA" | "BAILARINO_INDEPENDENTE";
  status: "COMPLETA" | "EM_ANDAMENTO";
};

export default function Admin() {
  const navigate = useNavigate();
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<any>(null);
  const [inscricoes, setInscricoes] = useState<InscricaoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [coreografiaSelecionada, setCoreografiaSelecionada] =
    useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");

    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    listarEscolasAdmin()
      .then((dados) => setInscricoes(dados || []))
      .finally(() => setLoading(false));
  }, []);

  async function abrirDetalhe(id: string) {
    setSelecionada(id);
    setCoreografiaSelecionada(null);

    const dados = await buscarEscolaAdmin(id);
    setDetalhe(dados);
  }

  function fecharDetalhe() {
    setSelecionada(null);
    setDetalhe(null);
    setCoreografiaSelecionada(null);
  }

  const tituloDetalhe =
    detalhe?.escola?.nome || detalhe?.independente?.nomeResponsavel;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-primary text-orange-500 mb-8">Inscricoes</h1>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : (
        <>
          <div className="mb-8 flex gap-6 text-sm text-gray-400">
            <span>Total: {inscricoes.length}</span>
          </div>

          <div className="flex flex-col gap-4">
            {inscricoes.map((inscricao) => (
              <div
                key={inscricao.id}
                onClick={() => abrirDetalhe(inscricao.id)}
                className="cursor-pointer hover:bg-zinc-800 transition p-5 rounded-xl bg-zinc-900 flex justify-between items-center"
              >
                <div>
                  {inscricao.tipoInscricao === "ESCOLA" ? (
                    <span className="px-2 py-1 rounded text-xs bg-orange-500 text-black font-semibold">
                      ESCOLA
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs border border-orange-500 text-orange-400 bg-black font-semibold">
                      BAILARINO INDEPENDENTE
                    </span>
                  )}
                  <div className="flex items-center gap-3 my-2">
                    <h2 className="font-secondary text-lg">{inscricao.nome}</h2>
                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    {inscricao.coreografiasCadastradas} coreografias
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-orange-500 font-bold text-lg">
                    R$ {inscricao.valorTotal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selecionada && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={fecharDetalhe}
          />

          <div className="relative bg-zinc-950 rounded-t-2xl p-6 h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-primary text-orange-500">
                {tituloDetalhe}
              </h2>

              <button
                onClick={fecharDetalhe}
                className="px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
              >
                Fechar
              </button>
            </div>

            {!detalhe ? (
              <p className="text-gray-400">Carregando...</p>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-6">
                  Total: R$ {detalhe.valores.total}
                </p>

                {detalhe.escola ? (
                  <div className="mb-6 space-y-2 text-sm text-gray-300">
                    <p>
                      <span className="text-gray-500">Diretor:</span>{" "}
                      {detalhe.escola.nomeDiretor}
                    </p>

                    <p>
                      <span className="text-gray-500">WhatsApp:</span>{" "}
                      {detalhe.escola.whatsapp}
                    </p>

                    <p>
                      <span className="text-gray-500">Endereco:</span>{" "}
                      {detalhe.escola.endereco}
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 space-y-2 text-sm text-gray-300">
                    <p>
                      <span className="text-gray-500">Responsavel:</span>{" "}
                      {detalhe.independente.nomeResponsavel}
                    </p>

                    <p>
                      <span className="text-gray-500">WhatsApp:</span>{" "}
                      {detalhe.independente.whatsapp}
                    </p>

                    <p>
                      <span className="text-gray-500">E-mail:</span>{" "}
                      {detalhe.independente.email}
                    </p>
                  </div>
                )}

                {!coreografiaSelecionada ? (
                  <>
                    <h3 className="font-secondary mb-4">Coreografias</h3>

                    <div className="flex flex-col gap-4">
                      {detalhe.detalhamento.coreografias.map((c: any) => (
                        <div
                          key={c.id}
                          onClick={() => setCoreografiaSelecionada(c)}
                          className="p-4 bg-zinc-900 rounded-xl cursor-pointer hover:bg-zinc-800 transition"
                        >
                          <p className="font-medium text-lg">{c.nome}</p>
                          <p className="text-sm text-gray-400">
                            {c.formacao} • {c.bailarinos} bailarinos
                          </p>
                          <p className="text-orange-500 font-semibold mt-2">
                            R$ {c.valor}
                          </p>
                        </div>
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

                    <div className="space-y-4">
                      <h3 className="text-xl font-primary text-orange-500">
                        {coreografiaSelecionada.nome}
                      </h3>

                      <div className="text-sm text-gray-300 space-y-2">
                        <p>
                          <span className="text-gray-500">Formacao:</span>{" "}
                          {coreografiaSelecionada.formacao}
                        </p>
                        <p>
                          <span className="text-gray-500">Modalidade:</span>{" "}
                          {coreografiaSelecionada.modalidade}
                        </p>
                        <p>
                          <span className="text-gray-500">Categoria:</span>{" "}
                          {coreografiaSelecionada.categoria}
                        </p>
                        <p>
                          <span className="text-gray-500">Duracao:</span>{" "}
                          {coreografiaSelecionada.duracao}
                        </p>
                        <p>
                          <span className="text-gray-500">Musica:</span>{" "}
                          {coreografiaSelecionada.musica}
                        </p>
                        <p>
                          <span className="text-gray-500">Tem cenario:</span>{" "}
                          {coreografiaSelecionada.temCenario ? "Sim" : "Nao"}
                        </p>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-secondary mb-3">Bailarinos</h4>

                        <div className="flex flex-col gap-2">
                          {coreografiaSelecionada.listaBailarinos?.map(
                            (b: any) => (
                              <div
                                key={b.id}
                                className="bg-zinc-900 p-3 rounded"
                              >
                                {b.nomeArtistico || b.nomeCompleto}
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="mt-6 text-right">
                        <p className="text-orange-500 font-bold text-2xl">
                          R$ {coreografiaSelecionada.valor}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
