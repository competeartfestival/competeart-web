import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";
import { REGULAMENTO_COMPETE_ART } from "../data/regulamentoCompeteArt";

type ValorRegulamento = string | number | boolean | null | ValorRegulamento[] | { [key: string]: ValorRegulamento };

const MAPA_ROTULOS_COMPLETOS: Record<string, string> = {
  CATEGORIAS_ETARIAS: "Categorias Etárias",
  DURACAO_COREOGRAFIA: "Duração da Coreografia",
  SISTEMA_DE_PONTUACAO: "Sistema de Pontuação",
  VALORES_E_PRAZOS: "Valores e Prazos",
  CRONOGRAMA_E_HORARIOS: "Cronograma e Horários",
  EQUIPE_TECNICA: "Equipe Técnica",
  ACESSO_AO_TEATRO: "Acesso ao Teatro",
  CAMARINS_E_COXIAS: "Camarins e Coxias",
  INFORMACOES_GERAIS: "Informações Gerais",
  RESPONSABILIDADE_MEDICA: "Responsabilidade Médica",
  DATA_E_HORA: "Data e Hora",
  O_QUE_E: "O que é",
};

const MAPA_PALAVRAS: Record<string, string> = {
  ETARIAS: "Etárias",
  DURACAO: "Duração",
  TECNICA: "Técnica",
  INFORMACOES: "Informações",
  MEDICA: "Médica",
  PONTUACAO: "Pontuação",
  AVALIACAO: "Avaliação",
  PREMIACAO: "Premiação",
  PREMIACOES: "Premiações",
  ORGANIZACAO: "Organização",
  INSCRICOES: "Inscrições",
  JURI: "Júri",
  NAO: "Não",
  CENARIO: "Cenário",
  MUSICA: "Música",
  Sênior: "Sênior",
  COREOGRAFOS: "Coreógrafos",
  DIRETORES_COREOGRAFOS: "Diretores/Coreógrafos",
};

function formatarRotulo(chave: string) {
  if (MAPA_ROTULOS_COMPLETOS[chave]) {
    return MAPA_ROTULOS_COMPLETOS[chave];
  }

  const rotuloBase = chave
    .replace(/^\d+_/, (n) => n.replace("_", "º "))
    .replace(/_/g, " ")
    .replace(/\b([A-Za-zÀ-ÿ])/g, (letra) => letra.toUpperCase());

  return rotuloBase
    .split(" ")
    .map((palavra) => MAPA_PALAVRAS[palavra] ?? palavra)
    .join(" ");
}

function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ListaStrings({ itens }: { itens: string[] }) {
  return (
    <ul className="space-y-2">
      {itens.map((item, indice) => (
        <li key={`${indice}-${item.slice(0, 20)}`} className="flex gap-3 text-gray-200">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RenderizadorValor({ valor, nivel = 0 }: { valor: ValorRegulamento; nivel?: number }) {
  if (valor == null) return null;

  if (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean") {
    return <p className="text-gray-200 leading-relaxed">{String(valor)}</p>;
  }

  if (Array.isArray(valor)) {
    const todosStrings = valor.every((item) => typeof item === "string");

    if (todosStrings) {
      return <ListaStrings itens={valor as string[]} />;
    }

    return (
      <div className="space-y-3">
        {valor.map((item, indice) => (
          <div key={indice} className="rounded-xl border border-zinc-800 bg-black/30 p-4">
            <RenderizadorValor valor={item} nivel={nivel + 1} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(valor).map(([chave, conteudo]) => (
        <div key={chave} className="rounded-xl border border-zinc-800 bg-black/20 p-4">
          <h4 className={`font-semibold mb-2 ${nivel > 0 ? "text-orange-300" : "text-white"}`}>
            {formatarRotulo(chave)}
          </h4>
          <RenderizadorValor valor={conteudo} nivel={nivel + 1} />
        </div>
      ))}
    </div>
  );
}

export default function Regulamento() {
  const navegar = useNavigate();

  const secoes = useMemo(() => {
    const {
      TITULO: _titulo,
      SUBTITULO: _subtitulo,
      DATA_E_HORA: _data,
      LOCAL: _local,
      ...restante
    } = REGULAMENTO_COMPETE_ART;

    return Object.entries(restante).map(([chave, valor]) => ({
      chave,
      valor,
      id: slugify(chave),
      titulo: formatarRotulo(chave),
    }));
  }, []);

  return (
    <PaginaComVoltar
      titulo={REGULAMENTO_COMPETE_ART.SUBTITULO}
      subtitulo="Leia atentamente as regras, prazos e orientações do Compete'Art Festival de Dança."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-7xl"
    >
      <div className="grid xl:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        <aside className="xl:sticky xl:top-6 space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Evento</p>
            <h2 className="mt-2 text-xl text-orange-400 font-primary leading-tight">
              {REGULAMENTO_COMPETE_ART.TITULO}
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                <p className="text-gray-400 uppercase tracking-wide text-xs">Data e horário</p>
                <p className="text-white mt-1">{REGULAMENTO_COMPETE_ART.DATA_E_HORA}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                <p className="text-gray-400 uppercase tracking-wide text-xs">Local</p>
                <p className="text-white mt-1">{REGULAMENTO_COMPETE_ART.LOCAL.NOME}</p>
                <p className="text-gray-300 mt-1 text-xs leading-relaxed">
                  {REGULAMENTO_COMPETE_ART.LOCAL.ENDERECO}
                </p>
              </div>
            </div>
          </div>

          <nav className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Sumário</p>
            <div className="max-h-[60vh] overflow-auto pr-1 space-y-1">
              {secoes.map((secao) => (
                <a
                  key={secao.id}
                  href={`#${secao.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-900 transition"
                >
                  {secao.titulo}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <div className="space-y-5">
          {secoes.map((secao) => (
            <section
              key={secao.id}
              id={secao.id}
              className="scroll-mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/65 p-5 md:p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold text-orange-300 mb-4">
                {secao.titulo}
              </h3>
              <RenderizadorValor valor={secao.valor as ValorRegulamento} />
            </section>
          ))}
        </div>
      </div>
    </PaginaComVoltar>
  );
}
