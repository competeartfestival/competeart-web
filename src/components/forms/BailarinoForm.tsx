import { useState } from "react";
import { criarBailarino } from "../../lib/api";

type BailarinoFormData = {
  nomeCompleto: string;
  nomeArtistico: string;
  cpf: string;
  dataNascimento: string;
};

type Props = {
  escolaId: string;
  onNovoBailarino: (bailarino: any) => void;
};

export default function BailarinoForm({ escolaId, onNovoBailarino }: Props) {
  const [formData, setFormData] = useState<BailarinoFormData>({
    nomeCompleto: "",
    nomeArtistico: "",
    cpf: "",
    dataNascimento: "",
  });

  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<Record<string, string>>({});

  function formatarCPF(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6)
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9)
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;

    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "cpf") {
      setFormData((prev) => ({
        ...prev,
        cpf: formatarCPF(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErroGeral(null);
    setErrosCampo({});

    const novosErros: Record<string, string> = {};
    const cpfSemMascara = formData.cpf.replace(/\D/g, "");

    if (!formData.nomeCompleto.trim()) {
      novosErros.nomeCompleto = "Informe o nome completo.";
    }

    if (!formData.nomeArtistico.trim()) {
      novosErros.nomeArtistico = "Informe o nome artistico.";
    }

    if (!formData.cpf.trim()) {
      novosErros.cpf = "Informe o CPF.";
    } else if (cpfSemMascara.length !== 11) {
      novosErros.cpf = "CPF inválido.";
    }

    if (!formData.dataNascimento) {
      novosErros.dataNascimento = "Informe a data de nascimento.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampo(novosErros);
      return;
    }

    try {
      const resultado = await criarBailarino(escolaId, {
        ...formData,
        cpf: cpfSemMascara,
      });

      onNovoBailarino({
        id: resultado.id,
        ...formData,
      });

      setFormData({
        nomeCompleto: "",
        nomeArtistico: "",
        cpf: "",
        dataNascimento: "",
      });
    } catch (error: any) {
      if (error?.field) {
        setErrosCampo({ [error.field]: error.message });
        return;
      }

      setErroGeral("Erro ao cadastrar bailarino. Tente novamente.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {erroGeral && (
          <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
            {erroGeral}
          </div>
        )}

        <input
          name="nomeCompleto"
          type="text"
          placeholder="Nome completo"
          value={formData.nomeCompleto}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
        />
        {errosCampo.nomeCompleto && (
          <p className="text-sm text-red-400">{errosCampo.nomeCompleto}</p>
        )}

        <input
          name="nomeArtistico"
          type="text"
          placeholder="Nome artístico"
          value={formData.nomeArtistico}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
        />
        {errosCampo.nomeArtistico && (
          <p className="text-sm text-red-400">{errosCampo.nomeArtistico}</p>
        )}
        <input
          name="cpf"
          type="text"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
        />
        {errosCampo.cpf && (
          <p className="text-sm text-red-400">{errosCampo.cpf}</p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Data de nascimento</label>
          <input
            name="dataNascimento"
            type="date"
            value={formData.dataNascimento}
            onChange={handleChange}
            className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
          />
        </div>
        {errosCampo.dataNascimento && (
          <p className="text-sm text-red-400">{errosCampo.dataNascimento}</p>
        )}

        <button
          type="submit"
          className="
          mt-4
          px-6 py-3
          border-2
          border-solid
          rounded-lg
          border-orange-500
          bg-transparent
          text-orange-500
          font-medium
          hover:bg-orange-500
          hover:text-black
        "
        >
          Salvar bailarino
        </button>
      </form>
    </div>
  );
}
