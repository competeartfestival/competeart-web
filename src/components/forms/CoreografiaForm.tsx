import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  criarCoreografia,
  criarCoreografiaIndependente,
  listarBailarinos,
  listarBailarinosIndependente,
  obterResumo,
  obterResumoIndependente,
} from "../../lib/api";

type DadosCoreografia = {
  nome: string;
  nomeCoreografo: string;
  formacao: string;
  modalidade: string;
  categoria: string;
  duracao: string;
  musica: string;
  temCenario: boolean;
};

type ErrosFormulario = Partial<Record<keyof DadosCoreografia, string>>;

type Propriedades = {
  inscricaoId: string;
  tipoInscricao: "escola" | "independente";
};

function obterLoteAtual(): 1 | 2 | 3 {
  const hoje = new Date();
  const ano = 2026;

  const fimLote1 = new Date(ano, 2, 26, 23, 59, 59);
  const fimLote2 = new Date(ano, 3, 2, 23, 59, 59);

  if (hoje <= fimLote1) return 1;
  if (hoje <= fimLote2) return 2;
  return 3;
}

function calcularValorCoreografia(formacao: string, quantidadeBailarinos: number): number {
  const lote = obterLoteAtual();

  const tabela: Record<string, number[]> = {
    SOLO: [160, 190, 210],
    DUO: [220, 240, 260],
    TRIO: [320, 340, 360],
    GRUPO: [80, 100, 120],
  };

  if (!tabela[formacao]) return 0;

  if (formacao === "GRUPO") {
    return tabela.GRUPO[lote - 1] * quantidadeBailarinos;
  }

  return tabela[formacao][lote - 1];
}

export default function CoreografiaForm({ inscricaoId, tipoInscricao }: Propriedades) {
  const navegar = useNavigate();

  const [dadosFormulario, setDadosFormulario] = useState<DadosCoreografia>({
    nome: "",
    nomeCoreografo: "",
    formacao: "",
    modalidade: "",
    categoria: "",
    duracao: "",
    musica: "",
    temCenario: false,
  });
  const [bailarinos, setBailarinos] = useState<any[]>([]);
  const [bailarinosSelecionados, setBailarinosSelecionados] = useState<string[]>([]);
  const [errosFormulario, setErrosFormulario] = useState<ErrosFormulario>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [limiteCoreografias, setLimiteCoreografias] = useState(0);
  const [coreografiasCadastradas, setCoreografiasCadastradas] = useState(0);
  const [mensagemFluxo, setMensagemFluxo] = useState<string | null>(null);
  const [carregandoProgresso, setCarregandoProgresso] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const carregamentoBailarinos =
          tipoInscricao === "escola"
            ? listarBailarinos(inscricaoId)
            : listarBailarinosIndependente(inscricaoId);

        const carregamentoResumo =
          tipoInscricao === "escola"
            ? obterResumo(inscricaoId)
            : obterResumoIndependente(inscricaoId);

        const [listaBailarinos, dadosResumo] = await Promise.all([
          carregamentoBailarinos,
          carregamentoResumo,
        ]);

        setBailarinos(listaBailarinos);
        setCoreografiasCadastradas(dadosResumo.totais.coreografias);

        if (tipoInscricao === "escola") {
          setLimiteCoreografias(dadosResumo.escola.limiteCoreografias);
        } else {
          setLimiteCoreografias(dadosResumo.independente.limiteCoreografias);
        }
      } finally {
        setCarregandoProgresso(false);
      }
    }

    carregarDados();
  }, [inscricaoId, tipoInscricao]);

  const faltamCoreografias = Math.max(0, limiteCoreografias - coreografiasCadastradas);

  function irParaConfirmacao() {
    if (tipoInscricao === "escola") {
      navegar(`/inscricao/${inscricaoId}/resumo`);
      return;
    }

    navegar(`/independentes/${inscricaoId}/resumo`);
  }

  function limparFormulario() {
    setDadosFormulario({
      nome: "",
      nomeCoreografo: "",
      formacao: "",
      modalidade: "",
      categoria: "",
      duracao: "",
      musica: "",
      temCenario: false,
    });
    setBailarinosSelecionados([]);
    setErrosFormulario({});
  }

  function limitePorFormacao(formacao: string) {
    switch (formacao) {
      case "SOLO":
        return 1;
      case "DUO":
        return 2;
      case "TRIO":
        return 3;
      case "GRUPO":
        return Infinity;
      default:
        return 0;
    }
  }

  function selecionarBailarino(id: string) {
    const limite = limitePorFormacao(dadosFormulario.formacao);

    if (bailarinosSelecionados.includes(id)) {
      setBailarinosSelecionados((listaAtual) => listaAtual.filter((b) => b !== id));
      return;
    }

    if (bailarinosSelecionados.length >= limite) {
      setErroGeral("Quantidade de bailarinos incompatível com a formação.");
      return;
    }

    setErroGeral(null);
    setBailarinosSelecionados((listaAtual) => [...listaAtual, id]);
  }

  function alterarCampo(
    evento: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = evento.target;

    setDadosFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]:
        type === "checkbox" ? (evento.target as HTMLInputElement).checked : value,
    }));

    if (errosFormulario[name as keyof DadosCoreografia]) {
      setErrosFormulario((errosAtuais) => {
        const copia = { ...errosAtuais };
        delete copia[name as keyof DadosCoreografia];
        return copia;
      });
    }
  }

  function alterarDuracao(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 4);

    if (numeros.length <= 2) {
      setDadosFormulario((dadosAtuais) => ({ ...dadosAtuais, duracao: numeros }));
    } else {
      const minutos = numeros.slice(0, 2);
      const segundos = numeros.slice(2);
      setDadosFormulario((dadosAtuais) => ({
        ...dadosAtuais,
        duracao: `${minutos}:${segundos}`,
      }));
    }

    if (errosFormulario.duracao) {
      setErrosFormulario((errosAtuais) => {
        const copia = { ...errosAtuais };
        delete copia.duracao;
        return copia;
      });
    }
  }

  function converterDuracaoParaSegundos(duracao: string): number {
    const partes = duracao.split(":").map(Number);
    if (partes.length !== 2 || partes.some(isNaN)) return 0;

    const [minutos, segundos] = partes;
    if (segundos > 59) return 0;

    return minutos * 60 + segundos;
  }

  function limiteDuracao(formacao: string) {
    return formacao === "GRUPO" ? 450 : 255;
  }

  function formatarDuracaoParaBackend(duracao: string) {
    const [minutos, segundos] = duracao.split(":");
    return `00:${minutos.padStart(2, "0")}:${segundos.padStart(2, "0")}`;
  }

  function validarFormulario(): boolean {
    const novosErros: ErrosFormulario = {};

    if (!dadosFormulario.nome.trim()) novosErros.nome = "Informe o nome da coreografia.";
    if (!dadosFormulario.nomeCoreografo.trim()) {
      novosErros.nomeCoreografo = "Informe o nome do coreógrafo.";
    }
    if (!dadosFormulario.formacao) novosErros.formacao = "Selecione a formação.";
    if (!dadosFormulario.modalidade) {
      novosErros.modalidade = "Selecione a modalidade.";
    }
    if (!dadosFormulario.categoria) novosErros.categoria = "Selecione a categoria.";
    if (!dadosFormulario.duracao) novosErros.duracao = "Informe a duração.";
    if (!dadosFormulario.musica.trim()) novosErros.musica = "Informe o nome da música.";

    if (bailarinosSelecionados.length === 0) {
      setErroGeral("Selecione ao menos um bailarino.");
    }

    setErrosFormulario(novosErros);

    return Object.keys(novosErros).length === 0 && bailarinosSelecionados.length > 0;
  }

  async function enviarFormulario(evento: React.FormEvent) {
    if (enviando) return;

    evento.preventDefault();
    setErroGeral(null);
    setMensagemFluxo(null);

    if (carregandoProgresso) return;

    if (limiteCoreografias > 0 && coreografiasCadastradas >= limiteCoreografias) {
      irParaConfirmacao();
      return;
    }

    if (!validarFormulario()) return;

    const duracaoSegundos = converterDuracaoParaSegundos(dadosFormulario.duracao);
    const limite = limiteDuracao(dadosFormulario.formacao);

    if (duracaoSegundos === 0) {
      setErrosFormulario((errosAtuais) => ({
        ...errosAtuais,
        duracao: "Formato inválido. Use MM:SS.",
      }));
      return;
    }

    if (duracaoSegundos > limite) {
      setErrosFormulario((errosAtuais) => ({
        ...errosAtuais,
        duracao: "Duração excede o limite permitido.",
      }));
      return;
    }

    try {
      setEnviando(true);

      const payload = {
        ...dadosFormulario,
        duracao: formatarDuracaoParaBackend(dadosFormulario.duracao),
        bailarinosIds: bailarinosSelecionados,
        lote: obterLoteAtual(),
        valor: calcularValorCoreografia(
          dadosFormulario.formacao,
          bailarinosSelecionados.length,
        ),
      };

      if (tipoInscricao === "escola") {
        await criarCoreografia(inscricaoId, payload);
      } else {
        await criarCoreografiaIndependente(inscricaoId, payload);
      }

      const novoTotal = coreografiasCadastradas + 1;
      const restante = Math.max(0, limiteCoreografias - novoTotal);
      setCoreografiasCadastradas(novoTotal);

      if (restante === 0) {
        irParaConfirmacao();
        return;
      }

      limparFormulario();
      setMensagemFluxo(
        `Coreografia salva com sucesso. Falta${restante > 1 ? "m" : ""} ${restante} para liberar a confirmação.`,
      );
    } catch (erro: any) {
      setErroGeral(erro?.message || "Erro ao salvar coreografia.");
    } finally {
      setEnviando(false);
    }
  }

  const valorCalculado =
    dadosFormulario.formacao && bailarinosSelecionados.length > 0
      ? calcularValorCoreografia(dadosFormulario.formacao, bailarinosSelecionados.length)
      : 0;

  return (
    <form onSubmit={enviarFormulario} className="max-w-6xl">
      <div className="mb-4 rounded-lg border border-orange-300/30 bg-orange-500/10 p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-orange-200">Regra da etapa</p>
        <p className="mt-1 text-sm text-white">
          É necessário cadastrar todas as coreografias para liberar a etapa de confirmação.
        </p>
        <p className="mt-1 text-xs text-gray-300">
          Progresso atual: {coreografiasCadastradas}/{limiteCoreografias || "-"} coreografias.
        </p>
      </div>

      {mensagemFluxo && (
        <div className="p-3 mb-4 rounded bg-emerald-500/10 text-emerald-300 text-sm">
          {mensagemFluxo}
        </div>
      )}

      {erroGeral && (
        <div className="p-3 mb-4 rounded bg-red-500/10 text-red-400 text-sm">{erroGeral}</div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 items-start">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                name="nome"
                placeholder="Nome da coreografia"
                value={dadosFormulario.nome}
                onChange={alterarCampo}
                className="w-full px-4 py-3 rounded bg-zinc-900 text-white"
              />
              {errosFormulario.nome && (
                <p className="text-xs text-red-400 mt-1">{errosFormulario.nome}</p>
              )}
            </div>

            <div>
              <input
                name="nomeCoreografo"
                placeholder="Nome do coreógrafo"
                value={dadosFormulario.nomeCoreografo}
                onChange={alterarCampo}
                className="w-full px-4 py-3 rounded bg-zinc-900 text-white"
              />
              {errosFormulario.nomeCoreografo && (
                <p className="text-xs text-red-400 mt-1">{errosFormulario.nomeCoreografo}</p>
              )}
            </div>

            <div>
              <select
                name="formacao"
                value={dadosFormulario.formacao}
                onChange={alterarCampo}
                className="w-full px-4 py-3 rounded bg-zinc-900 text-white"
              >
                <option value="">Formação</option>
                <option value="SOLO">Solo</option>
                <option value="DUO">Duo</option>
                <option value="TRIO">Trio</option>
                <option value="GRUPO">Grupo</option>
              </select>
              {errosFormulario.formacao && (
                <p className="text-xs text-red-400 mt-1">{errosFormulario.formacao}</p>
              )}
            </div>

            <div>
              <select
                name="modalidade"
                value={dadosFormulario.modalidade}
                onChange={alterarCampo}
                className="w-full px-4 py-3 rounded bg-zinc-900 text-white"
              >
                <option value="">Modalidade</option>
                <option value="BALLET_CLASSICO">Ballet Clássico</option>
                <option value="BALLET_NEOCLASSICO">Ballet Neoclássico</option>
                <option value="JAZZ">Jazz</option>
                <option value="CONTEMPORANEO">Contemporâneo</option>
                <option value="DANCAS_URBANAS">Danças Urbanas</option>
                <option value="SAPATEADO">Sapateado</option>
                <option value="ESTILO_LIVRE">Estilo Livre</option>
              </select>
              {errosFormulario.modalidade && (
                <p className="text-xs text-red-400 mt-1">{errosFormulario.modalidade}</p>
              )}
            </div>

            <div>
              <select
                name="categoria"
                value={dadosFormulario.categoria}
                onChange={alterarCampo}
                className="w-full px-4 py-3 rounded bg-zinc-900 text-white"
              >
                <option value="">Categoria</option>
                <option value="BABY">Baby</option>
                <option value="INFANTIL_I">Infantil I</option>
                <option value="INFANTIL_II">Infantil II</option>
                <option value="JUVENIL_I">Juvenil I</option>
                <option value="JUVENIL_II">Juvenil II</option>
                <option value="ADULTO">Adulto</option>
                <option value="ADULTO_INICIANTE">Adulto Iniciante</option>
                <option value="SENIOR">Sênior</option>
                <option value="MASTER">Master</option>
              </select>
              {errosFormulario.categoria && (
                <p className="text-xs text-red-400 mt-1">{errosFormulario.categoria}</p>
              )}
            </div>

            <div>
              <input
                name="duracao"
                placeholder="Duração (MM:SS)"
                value={dadosFormulario.duracao}
                onChange={(evento) => alterarDuracao(evento.target.value)}
                maxLength={5}
                className="w-full px-4 py-3 rounded bg-zinc-900 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Consulte o regulamento para limites de duração.
              </p>
              {errosFormulario.duracao && (
                <p className="text-xs text-red-400 mt-1">{errosFormulario.duracao}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <input
                name="musica"
                placeholder="Música"
                value={dadosFormulario.musica}
                onChange={alterarCampo}
                className="w-full px-4 py-3 rounded bg-zinc-900 text-white"
              />
              {errosFormulario.musica && (
                <p className="text-xs text-red-400 mt-1">{errosFormulario.musica}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                type="checkbox"
                name="temCenario"
                checked={dadosFormulario.temCenario}
                onChange={alterarCampo}
              />
              Tem cenário?
            </label>
          </div>

          <button
            type="submit"
            disabled={
              carregandoProgresso ||
              enviando ||
              (limiteCoreografias > 0 && faltamCoreografias === 0)
            }
            className="px-6 py-3 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {carregandoProgresso
              ? "Carregando..."
              : enviando
              ? "Concluindo..."
              : limiteCoreografias > 0 && faltamCoreografias === 0
                ? "Limite de coreografias atingido"
                : "Salvar Coreografia"}
          </button>

          {limiteCoreografias > 0 && faltamCoreografias === 0 && (
            <button
              type="button"
              onClick={irParaConfirmacao}
              className="ml-3 px-6 py-3 rounded-lg border border-orange-300/40 bg-zinc-900 text-orange-200 hover:bg-zinc-800 transition"
            >
              Ir para confirmação
            </button>
          )}
        </div>

        <aside className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 md:p-5">
          <h3 className="font-secondary font-semibold mb-3">Selecionar bailarinos</h3>

          {dadosFormulario.formacao ? (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {bailarinos.map((bailarino) => (
                <li
                  key={bailarino.id}
                  onClick={() => selecionarBailarino(bailarino.id)}
                  className={`px-4 py-2 rounded cursor-pointer transition ${
                    bailarinosSelecionados.includes(bailarino.id)
                      ? "bg-orange-500 text-black"
                      : "bg-zinc-950 text-white border border-zinc-800"
                  }`}
                >
                  {bailarino.nomeArtistico || bailarino.nomeCompleto}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Selecione a formação para liberar o elenco.</p>
          )}

          <p className="text-sm text-gray-400 mt-3">
            Selecionados: {bailarinosSelecionados.length}
          </p>

          <p className="text-sm text-gray-400 mt-2">Lote atual: {obterLoteAtual()}º lote</p>
          <p className="text-sm text-gray-300 mt-2">
            Faltam para confirmação: <span className="text-orange-300">{faltamCoreografias}</span>
          </p>

          {valorCalculado > 0 && (
            <div className="mt-4 p-4 rounded bg-zinc-950 border border-zinc-800">
              <p className="text-sm text-gray-300">Valor da coreografia</p>
              <p className="text-2xl font-bold text-orange-500">R$ {valorCalculado}</p>
            </div>
          )}
        </aside>
      </div>
    </form>
  );
}
