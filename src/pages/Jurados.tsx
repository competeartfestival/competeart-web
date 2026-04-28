import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";
import juradosDataBruto from "../data/juradosData.json?raw";

type Jurado = {
  id: string;
  nome: string;
  foto: string;
  bio: string;
  tags: string[];
};

const jurados: Jurado[] = JSON.parse(juradosDataBruto) as Jurado[];

const TERMOS_INSTITUICOES = [
  "Escola do Teatro Bolshoi no Brasil",
  "Theatro Municipal de São Paulo",
  "Cisne Negro Cia de Dança",
  "São Paulo Companhia de Dança",
  "São Paulo Escola de Dança",
  "Cia Deborah Colker",
  "Centro de Movimento Deborah Colker",
  "Balé Teatro Castro Alves",
  "Escola Superior de Dança em Lisboa",
  "Cia Independente de Dança de São Paulo",
  "Royal Academy of Dance",
  "Broadway Dance Center",
  "Festival de Dança de Joinville",
  "Conservatório Carlos Gomes",
  "Cia Tinkle Group",
  "Studio Harmonic",
  "Companhia Conceito Urbano",
  "PEC Studio",
  "Grupo Sigma",
  "Teatro Municipal",
  "Ballet Nacional de Cuba",
  "Hartford School Ballet",
  "World Ballet Competition",
  "SOS Bailarina",
  "Revista Dança Brasil",
  "Gelsey Kirkland Ballet",
  "Arts Ballet Theatre of Florida",
  "Instituto de Ballet Johnny Almeida",
  "Livorno in Danza",
];

const TERMOS_PREMIOS = [
  "tricampeonato",
  "tricampeão",
  "tricampeonatos",
  "melhor bailarina",
  "melhor bailarino",
  "melhor coreógrafo",
  "melhor coreógrafa",
  "22 premiações",
  "premiações expressivas",
  "primeiros lugares",
  "campeão",
  "finalista",
  "bolsista",
  "bolsas",
];

const TERMOS_CIDADES = [
  "São Paulo",
  "Campinas",
  "Lisboa",
  "Espanha",
  "Portugal",
  "Argentina",
  "Holanda",
  "Nova York",
  "Roma",
  "Londres",
  "Itatiba",
  "Paris",
  "Sorocaba",
  "Bauru",
  "Los Angeles",
  "Boston",
  "Orlando",
  "Miami",
  "Dinamarca",
  "França",
  "Itália",
  "América Latina",
  "Europa",
  "Mercosul",
  "Brasil",
];

const CLASSES_DESTAQUE = {
  instituicao: "font-semibold text-orange-300",
  premio: "font-semibold text-cyan-200",
  cidade: "font-semibold text-fuchsia-200",
} as const;

function escaparRegExp(valor: string) {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escaparHtml(valor: string) {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function destacarTermos(texto: string, termos: string[], classe: string) {
  const termosOrdenados = [...termos].sort((a, b) => b.length - a.length);

  return termosOrdenados.reduce((acumulado, termo) => {
    const padrao = new RegExp(`(${escaparRegExp(termo)})`, "gi");
    return acumulado.replace(padrao, `<span class=\"${classe}\">$1</span>`);
  }, texto);
}

function formatarBioComDestaques(bio: string) {
  let texto = escaparHtml(bio);

  texto = destacarTermos(texto, TERMOS_INSTITUICOES, CLASSES_DESTAQUE.instituicao);
  texto = destacarTermos(texto, TERMOS_PREMIOS, CLASSES_DESTAQUE.premio);
  texto = destacarTermos(texto, TERMOS_CIDADES, CLASSES_DESTAQUE.cidade);

  const paragrafos = texto
    .split(/\n{2,}/)
    .map((paragrafo) => `<p class=\"leading-relaxed text-gray-200\">${paragrafo.replace(/\n/g, "<br />")}</p>`)
    .join("<div class=\"h-3\"></div>");

  return paragrafos;
}

function CartaoJurado({ jurado, aoSelecionar }: { jurado: Jurado; aoSelecionar: (jurado: Jurado) => void }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);

  return (
    <button
      type="button"
      onClick={() => aoSelecionar(jurado)}
      className="group text-left rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/60 hover:border-orange-400/45 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        {imagemFalhou ? (
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.22),transparent_58%),radial-gradient(circle_at_80%_90%,rgba(244,114,182,0.16),transparent_60%)] flex items-center justify-center">
            <span className="font-primary text-2xl text-orange-300">
              {jurado.nome
                .split(" ")
                .slice(0, 2)
                .map((nome) => nome[0])
                .join("")}
            </span>
          </div>
        ) : (
          <img
            src={`/${jurado.foto}`}
            alt={jurado.nome}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
            onError={() => setImagemFalhou(true)}
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70" />
      </div>

      <div className="p-3 md:p-4">
        <div className="flex flex-wrap gap-1.5">
          {jurado.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-orange-400/30 bg-orange-500/10 px-2 py-0.5 text-[11px] text-orange-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export default function Jurados() {
  const [juradoSelecionado, setJuradoSelecionado] = useState<Jurado | null>(null);
  const [painelVisivel, setPainelVisivel] = useState(false);
  const timeoutFechamentoRef = useRef<number | null>(null);

  const bioFormatada = useMemo(() => {
    if (!juradoSelecionado) return "";
    return formatarBioComDestaques(juradoSelecionado.bio);
  }, [juradoSelecionado]);

  useEffect(() => {
    if (juradoSelecionado) {
      const id = window.requestAnimationFrame(() => setPainelVisivel(true));
      document.body.style.overflow = "hidden";
      return () => {
        window.cancelAnimationFrame(id);
        document.body.style.overflow = "";
      };
    }

    return undefined;
  }, [juradoSelecionado]);

  useEffect(() => {
    return () => {
      if (timeoutFechamentoRef.current) {
        window.clearTimeout(timeoutFechamentoRef.current);
      }
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function onEsc(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        fecharDrawer();
      }
    }

    if (juradoSelecionado) {
      window.addEventListener("keydown", onEsc);
      return () => window.removeEventListener("keydown", onEsc);
    }

    return undefined;
  }, [juradoSelecionado]);

  function abrirDrawer(jurado: Jurado) {
    if (timeoutFechamentoRef.current) {
      window.clearTimeout(timeoutFechamentoRef.current);
      timeoutFechamentoRef.current = null;
    }

    setJuradoSelecionado(jurado);
    setPainelVisivel(false);
  }

  function fecharDrawer() {
    setPainelVisivel(false);

    timeoutFechamentoRef.current = window.setTimeout(() => {
      setJuradoSelecionado(null);
      timeoutFechamentoRef.current = null;
    }, 220);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-6 md:px-10 md:py-8 text-white">
      <FundoFestival />

      <div className="relative z-20 mx-auto max-w-6xl">
        <HeaderSite />

        <header className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/65 p-5 md:p-7 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Corpo de jurados</p>
          <h1 className="mt-2 font-primary text-3xl md:text-5xl text-white">Especialistas do festival</h1>
          <p className="mt-3 max-w-3xl text-gray-300 leading-relaxed">
            Conheça os profissionais convidados para avaliar técnica, presença cênica,
            criatividade e musicalidade no Compete'Art Festival de Dança.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {jurados.map((jurado) => (
            <CartaoJurado key={jurado.id} jurado={jurado} aoSelecionar={abrirDrawer} />
          ))}
        </section>
      </div>

      {juradoSelecionado && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center">
          <button
            type="button"
            aria-label="Fechar detalhes do jurado"
            onClick={fecharDrawer}
            className={`absolute inset-0 bg-black/75 backdrop-blur-[1px] transition-opacity duration-200 ${
              painelVisivel ? "opacity-100" : "opacity-0"
            }`}
          />

          <article
            role="dialog"
            aria-modal="true"
            className={`relative z-10 w-full max-h-[80vh] md:max-h-[86vh] md:w-[min(920px,92vw)] overflow-hidden rounded-t-3xl md:rounded-3xl border border-zinc-700 bg-zinc-950 shadow-2xl transition-all duration-200 ${
              painelVisivel
                ? "translate-y-0 opacity-100"
                : "translate-y-8 md:translate-y-12 opacity-0"
            }`}
          >
            <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-5 py-4 md:px-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Jurado convidado</p>
                  <h2 className="mt-1 font-primary text-2xl md:text-3xl text-white">
                    {juradoSelecionado.nome}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {juradoSelecionado.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fecharDrawer}
                  aria-label="Fechar"
                  className="h-10 w-10 rounded-full border border-zinc-700 bg-black/40 text-gray-200 hover:text-white hover:border-orange-400/50 transition flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-5 md:px-7 md:py-6">
              <div
                className="text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: bioFormatada }}
              />
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
