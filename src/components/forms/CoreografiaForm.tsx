import { useState, useEffect } from "react";
import { listarBailarinos, criarCoreografia } from "../../lib/api";
import { useNavigate } from "react-router-dom";

type CoreografiaFormData = {
  nome: string;
  nomeCoreografo: string;
  formacao: string;
  modalidade: string;
  categoria: string;
  duracao: string;
  musica: string;
  temCenario: boolean;
};

type FormErrors = Partial<Record<keyof CoreografiaFormData, string>>;

type Props = {
  escolaId: string;
};

function obterLoteAtual(): 1 | 2 | 3 {
  const hoje = new Date();
  const ano = 2026;

  const lote1Fim = new Date(ano, 2, 26, 23, 59, 59);
  const lote2Fim = new Date(ano, 3, 2, 23, 59, 59);

  if (hoje <= lote1Fim) return 1;
  if (hoje <= lote2Fim) return 2;
  return 3;
}

function calcularValorCoreografia(
  formacao: string,
  quantidadeBailarinos: number,
): number {
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

export default function CoreografiaForm({ escolaId }: Props) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CoreografiaFormData>({
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
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [erroForm, setErroForm] = useState<string | null>(null);

  useEffect(() => {
    listarBailarinos(escolaId).then(setBailarinos);
  }, [escolaId]);

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

  function toggleBailarino(id: string) {
    const limite = limitePorFormacao(formData.formacao);

    if (selecionados.includes(id)) {
      setSelecionados((prev) => prev.filter((b) => b !== id));
      return;
    }

    if (selecionados.length >= limite) {
      setErroForm("Quantidade de bailarinos incompatível com a formação.");
      return;
    }

    setErroForm(null);
    setSelecionados((prev) => [...prev, id]);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name as keyof CoreografiaFormData]) {
      setErrors((prev) => {
        const copia = { ...prev };
        delete copia[name as keyof CoreografiaFormData];
        return copia;
      });
    }
  }

  function handleDuracaoChange(valor: string) {
    let numeros = valor.replace(/\D/g, "").slice(0, 4);

    if (numeros.length <= 2) {
      setFormData((prev) => ({ ...prev, duracao: numeros }));
    } else {
      const minutos = numeros.slice(0, 2);
      const segundos = numeros.slice(2);
      setFormData((prev) => ({
        ...prev,
        duracao: `${minutos}:${segundos}`,
      }));
    }

    if (errors.duracao) {
      setErrors((prev) => {
        const copia = { ...prev };
        delete copia.duracao;
        return copia;
      });
    }
  }

  function duracaoEmSegundos(duracao: string): number {
    const partes = duracao.split(":").map(Number);
    if (partes.length !== 2 || partes.some(isNaN)) return 0;

    const [min, seg] = partes;
    if (seg > 59) return 0;

    return min * 60 + seg;
  }

  function limiteDuracao(formacao: string) {
    return formacao === "GRUPO" ? 450 : 255;
  }

  function converterParaFormatoBackend(duracao: string) {
    const [min, seg] = duracao.split(":");
    return `00:${min.padStart(2, "0")}:${seg.padStart(2, "0")}`;
  }

  function validarFormulario(): boolean {
    const novosErros: FormErrors = {};

    if (!formData.nome.trim())
      novosErros.nome = "Informe o nome da coreografia.";

    if (!formData.nomeCoreografo.trim())
      novosErros.nomeCoreografo = "Informe o nome do coreógrafo.";

    if (!formData.formacao) novosErros.formacao = "Selecione a formação.";

    if (!formData.modalidade) novosErros.modalidade = "Selecione a modalidade.";

    if (!formData.categoria) novosErros.categoria = "Selecione a categoria.";

    if (!formData.duracao) novosErros.duracao = "Informe a duração.";

    if (!formData.musica.trim())
      novosErros.musica = "Informe o nome da música.";

    if (selecionados.length === 0)
      setErroForm("Selecione ao menos um bailarino.");

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0 && selecionados.length > 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroForm(null);

    if (!validarFormulario()) return;

    const duracaoSeg = duracaoEmSegundos(formData.duracao);
    const limite = limiteDuracao(formData.formacao);

    if (duracaoSeg === 0) {
      setErrors((prev) => ({
        ...prev,
        duracao: "Formato inválido. Use MM:SS.",
      }));
      return;
    }

    if (duracaoSeg > limite) {
      setErrors((prev) => ({
        ...prev,
        duracao: "Duração excede o limite permitido.",
      }));
      return;
    }

    try {
      const lote = obterLoteAtual();
      const valor = calcularValorCoreografia(
        formData.formacao,
        selecionados.length,
      );

      await criarCoreografia(escolaId, {
        ...formData,
        duracao: converterParaFormatoBackend(formData.duracao),
        bailarinosIds: selecionados,
        lote,
        valor,
      });

      navigate(`/inscricao/${escolaId}/resumo`);
    } catch (error: any) {
      setErroForm(error?.message || "Erro ao salvar coreografia.");
    }
  }

  const valorCoreografia =
    formData.formacao && selecionados.length > 0
      ? calcularValorCoreografia(formData.formacao, selecionados.length)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      {erroForm && (
        <div className="p-3 rounded bg-red-500/10 text-red-400 text-sm">
          {erroForm}
        </div>
      )}

      <input
        name="nome"
        placeholder="Nome da coreografia"
        value={formData.nome}
        onChange={handleChange}
        className="px-4 py-3 rounded bg-zinc-900 text-white"
      />
      {errors.nome && <p className="text-xs text-red-400">{errors.nome}</p>}

      <input
        name="nomeCoreografo"
        placeholder="Nome do coreógrafo"
        value={formData.nomeCoreografo}
        onChange={handleChange}
        className="px-4 py-3 rounded bg-zinc-900 text-white"
      />
      {errors.nomeCoreografo && (
        <p className="text-xs text-red-400">{errors.nomeCoreografo}</p>
      )}

      <select
        name="formacao"
        value={formData.formacao}
        onChange={handleChange}
        className="px-4 py-3 rounded bg-zinc-900 text-white"
      >
        <option value="">Formação</option>
        <option value="SOLO">Solo</option>
        <option value="DUO">Duo</option>
        <option value="TRIO">Trio</option>
        <option value="GRUPO">Grupo</option>
      </select>
      {errors.formacao && (
        <p className="text-xs text-red-400">{errors.formacao}</p>
      )}

      {formData.formacao && (
        <div className="mt-6">
          <h3 className="font-secondary font-semibold mb-3">
            Selecionar bailarinos
          </h3>

          <ul className="flex flex-col gap-2">
            {bailarinos.map((b) => (
              <li
                key={b.id}
                onClick={() => toggleBailarino(b.id)}
                className={`
            px-4 py-2 rounded cursor-pointer
            ${
              selecionados.includes(b.id)
                ? "bg-orange-500 text-black"
                : "bg-zinc-900 text-white"
            }
          `}
              >
                {b.nomeArtistico || b.nomeCompleto}
              </li>
            ))}
          </ul>

          <p className="text-sm text-gray-400 mt-2">
            Selecionados: {selecionados.length}
          </p>
        </div>
      )}

      <select
        name="modalidade"
        value={formData.modalidade}
        onChange={handleChange}
        className="px-4 py-3 rounded bg-zinc-900 text-white"
      >
        <option value="">Modalidade</option>
        <option value="BALLET_CLASSICO">Ballet Clássico</option>
        <option value="BALLET_NEOCLASSICO">Ballet Neoclássico</option>
        <option value="JAZZ">Jazz</option>
        <option value="CONTEMPORANEO">Contemporâneo</option>
        <option value="DANCAS_URBANAS">Danças Urbanas</option>
        <option value="SAPATEADO">Sapateado</option>
        <option value="ESTILO_LIVRE">Estilo Livre</option>
        <option value="OUTROS">Outros</option>
      </select>

      <select
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
        className="px-4 py-3 rounded bg-zinc-900 text-white"
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

      <input
        name="duracao"
        placeholder="Duração (MM:SS)"
        value={formData.duracao}
        onChange={(e) => handleDuracaoChange(e.target.value)}
        maxLength={5}
        className="px-4 py-3 rounded bg-zinc-900 text-white"
      />
      {errors.duracao && (
        <p className="text-xs text-red-400">{errors.duracao}</p>
      )}

      <input
        name="musica"
        placeholder="Música"
        value={formData.musica}
        onChange={handleChange}
        className="px-4 py-3 rounded bg-zinc-900 text-white"
      />
      {errors.musica && <p className="text-xs text-red-400">{errors.musica}</p>}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="temCenario"
          checked={formData.temCenario}
          onChange={handleChange}
        />
        Tem cenário?
      </label>

      {obterLoteAtual() ? (
        <p className="text-sm text-gray-400">
          Lote atual: {obterLoteAtual()}º lote
        </p>
      ) : (
        <p className="text-sm text-red-400">Inscrições fora do período</p>
      )}

      {valorCoreografia > 0 && (
        <div className="mt-4 p-4 rounded bg-zinc-900">
          <p className="text-sm text-gray-300">Valor da coreografia</p>
          <p className="text-2xl font-bold text-orange-500">
            R$ {valorCoreografia}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="mt-4 px-6 py-3 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600"
      >
        Salvar Coreografia
      </button>
    </form>
  );
}
