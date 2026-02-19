import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarIndependente } from "../../lib/api";

type DadosIndependente = {
  nomeResponsavel: string;
  email: string;
  whatsapp: string;
  limiteCoreografias: number;
};

export default function IndependenteForm() {
  const navegar = useNavigate();

  const [dadosFormulario, setDadosFormulario] = useState<DadosIndependente>({
    nomeResponsavel: "",
    email: "",
    whatsapp: "",
    limiteCoreografias: 1,
  });
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function alterarCampo(evento: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evento.target;

    setDadosFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: name === "limiteCoreografias" ? Number(value) : value,
    }));
  }

  async function enviarFormulario(evento: React.FormEvent) {
    if (enviando) return;

    evento.preventDefault();
    setErroGeral(null);
    setErrosCampo({});

    const novosErros: Record<string, string> = {};

    if (!dadosFormulario.nomeResponsavel.trim()) {
      novosErros.nomeResponsavel = "Informe o seu nome completo.";
    }
    if (!dadosFormulario.email.trim()) novosErros.email = "Informe o e-mail.";
    if (!dadosFormulario.whatsapp.trim()) {
      novosErros.whatsapp = "Informe o WhatsApp.";
    }
    if (dadosFormulario.limiteCoreografias < 1) {
      novosErros.limiteCoreografias = "Informe pelo menos 1 coreografia.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampo(novosErros);
      return;
    }

    try {
      setEnviando(true);
      const resposta = await criarIndependente(dadosFormulario);
      navegar(`/independentes/${resposta.id}/elenco`);
    } catch (erro: any) {
      setErroGeral(erro?.message || "Erro ao criar inscrição independente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviarFormulario} className="max-w-4xl mx-auto">
      {erroGeral && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-400 text-sm">{erroGeral}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input
            name="nomeResponsavel"
            type="text"
            placeholder="Nome do responsável"
            value={dadosFormulario.nomeResponsavel}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.nomeResponsavel && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.nomeResponsavel}</p>
          )}
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={dadosFormulario.email}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.email && <p className="text-sm text-red-400 mt-1">{errosCampo.email}</p>}
        </div>

        <div>
          <input
            name="whatsapp"
            type="tel"
            placeholder="WhatsApp"
            value={dadosFormulario.whatsapp}
            onChange={(evento) =>
              setDadosFormulario((dadosAtuais) => ({
                ...dadosAtuais,
                whatsapp: formatarTelefone(evento.target.value),
              }))
            }
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.whatsapp && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.whatsapp}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-1">Quantidade de coreografias</label>
          <input
            name="limiteCoreografias"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Quantidade de coreografias"
            value={dadosFormulario.limiteCoreografias}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.limiteCoreografias && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.limiteCoreografias}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="mt-8 px-6 py-3 bg-orange-500 text-black font-medium transition-colors hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {enviando ? "Avançando..." : "Avançar"}
      </button>
    </form>
  );
}
