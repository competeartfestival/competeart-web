import { useState } from "react";
import { criarBailarino, criarBailarinoIndependente } from "../../lib/api";

type DadosBailarino = {
  nomeCompleto: string;
  nomeArtistico: string;
  cpf: string;
  dataNascimento: string;
};

type Propriedades = {
  inscricaoId: string;
  tipoInscricao: "escola" | "independente";
  aoCadastrarBailarino: (bailarino: any) => void;
};

export default function BailarinoForm({
  inscricaoId,
  tipoInscricao,
  aoCadastrarBailarino,
}: Propriedades) {
  const [dadosFormulario, setDadosFormulario] = useState<DadosBailarino>({
    nomeCompleto: "",
    nomeArtistico: "",
    cpf: "",
    dataNascimento: "",
  });
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  function formatarCpf(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    }

    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
  }

  function alterarCampo(evento: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evento.target;

    if (name === "cpf") {
      setDadosFormulario((dadosAtuais) => ({
        ...dadosAtuais,
        cpf: formatarCpf(value),
      }));
      return;
    }

    setDadosFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  async function enviarFormulario(evento: React.FormEvent) {
    if (enviando) return;

    evento.preventDefault();
    setErroGeral(null);
    setErrosCampo({});

    const novosErros: Record<string, string> = {};
    const cpfSemMascara = dadosFormulario.cpf.replace(/\D/g, "");

    if (!dadosFormulario.nomeCompleto.trim()) {
      novosErros.nomeCompleto = "Informe o nome completo.";
    }

    if (!dadosFormulario.nomeArtistico.trim()) {
      novosErros.nomeArtistico = "Informe o nome artístico.";
    }

    if (!dadosFormulario.cpf.trim()) {
      novosErros.cpf = "Informe o CPF.";
    } else if (cpfSemMascara.length !== 11) {
      novosErros.cpf = "CPF inválido.";
    }

    if (!dadosFormulario.dataNascimento) {
      novosErros.dataNascimento = "Informe a data de nascimento.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampo(novosErros);
      return;
    }

    try {
      setEnviando(true);
      const payload = {
        ...dadosFormulario,
        cpf: cpfSemMascara,
      };

      const resposta =
        tipoInscricao === "escola"
          ? await criarBailarino(inscricaoId, payload)
          : await criarBailarinoIndependente(inscricaoId, payload);

      aoCadastrarBailarino({
        id: resposta.id,
        ...dadosFormulario,
      });

      setDadosFormulario({
        nomeCompleto: "",
        nomeArtistico: "",
        cpf: "",
        dataNascimento: "",
      });
    } catch {
      setErroGeral("Erro ao cadastrar bailarino. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviarFormulario} className="flex flex-col gap-4 max-w-2xl w-full">
      {erroGeral && (
        <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm">{erroGeral}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input
            name="nomeCompleto"
            type="text"
            placeholder="Nome completo"
            value={dadosFormulario.nomeCompleto}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
          />
          {errosCampo.nomeCompleto && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.nomeCompleto}</p>
          )}
        </div>

        <div>
          <input
            name="nomeArtistico"
            type="text"
            placeholder="Nome artístico"
            value={dadosFormulario.nomeArtistico}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
          />
          {errosCampo.nomeArtistico && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.nomeArtistico}</p>
          )}
        </div>

        <div>
          <input
            name="cpf"
            type="text"
            placeholder="CPF"
            value={dadosFormulario.cpf}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
          />
          {errosCampo.cpf && <p className="text-sm text-red-400 mt-1">{errosCampo.cpf}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-1">Data de nascimento</label>
          <input
            name="dataNascimento"
            type="date"
            value={dadosFormulario.dataNascimento}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
          />
          {errosCampo.dataNascimento && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.dataNascimento}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="mt-2 px-6 py-3 border-2 border-orange-500 rounded-lg bg-transparent text-orange-500 font-medium hover:bg-orange-500 hover:text-black disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {enviando ? "Salvando..." : "Salvar bailarino"}
      </button>
    </form>
  );
}
