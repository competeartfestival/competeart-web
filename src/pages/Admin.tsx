import { useEffect, useState } from "react";
import { listarEscolasAdmin, buscarEscolaAdmin } from "../lib/api";
import { useNavigate } from "react-router-dom";

type EscolaAdmin = {
  id: string;
  nome: string;
  limiteCoreografias: number;
  coreografiasCadastradas: number;
  valorTotal: number;
  status: "COMPLETA" | "EM_ANDAMENTO";
};

export default function Admin() {
  const navigate = useNavigate();
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<any>(null);
  const [escolas, setEscolas] = useState<EscolaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [coreografiaSelecionada, setCoreografiaSelecionada] =
    useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");

    if (!token) {
      navigate("/admin/login");
    }
  }, []);

  useEffect(() => {
    listarEscolasAdmin()
      .then(setEscolas)
      .finally(() => setLoading(false));
  }, []);

  async function abrirDetalhe(id: string) {
    setSelecionada(id);

    const dados = await buscarEscolaAdmin(id);
    setDetalhe(dados);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-primary text-orange-500 mb-8">Inscrições</h1>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : (
        <>
          <div className="mb-8 flex gap-6 text-sm text-gray-400">
            <span>Total: {escolas.length}</span>
          </div>

          <div className="flex flex-col gap-4">
            {escolas.map((escola) => (
              <div
                key={escola.id}
                onClick={() => abrirDetalhe(escola.id)}
                className="
        cursor-pointer
        hover:bg-zinc-800
        transition
        p-5
        rounded-xl
        bg-zinc-900
        flex justify-between items-center
      "
              >
                <div>
                  <h2 className="font-secondary text-lg">{escola.nome}</h2>

                  <p className="text-sm text-gray-400 mt-1">
                    {escola.coreografiasCadastradas} coreografias
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-orange-500 font-bold text-lg">
                    R$ {escola.valorTotal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {selecionada && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelecionada(null);
              setDetalhe(null);
            }}
          />

          {/* Bottom Sheet */}
          <div
            className="
        relative
        bg-zinc-950
        rounded-t-2xl
        p-6
        h-[90vh]
        overflow-y-auto
        shadow-2xl
        animate-slideUp
      "
          >
            {/* Botão fechar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-primary text-orange-500">
                {detalhe?.escola?.nome}
              </h2>

              <button
                onClick={() => {
                  setSelecionada(null);
                  setDetalhe(null);
                }}
                className="
            px-4 py-2
            text-sm
            rounded-lg
            bg-zinc-800
            hover:bg-zinc-700
            transition
          "
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
                    <span className="text-gray-500">Endereço:</span>{" "}
                    {detalhe.escola.endereco}
                  </p>
                </div>

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
                          <span className="text-gray-500">Formação:</span>{" "}
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
                          <span className="text-gray-500">Duração:</span>{" "}
                          {coreografiaSelecionada.duracao}
                        </p>
                        <p>
                          <span className="text-gray-500">Música:</span>{" "}
                          {coreografiaSelecionada.musica}
                        </p>
                        <p>
                          <span className="text-gray-500">Tem cenário:</span>{" "}
                          {coreografiaSelecionada.temCenario ? "Sim" : "Não"}
                        </p>
                      </div>

                      {/* <div className="mt-6">
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
                      </div> */}

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
