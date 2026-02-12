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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const resultado = await criarBailarino(escolaId, formData);

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
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar bailarino");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          name="nomeCompleto"
          type="text"
          placeholder="Nome completo"
          value={formData.nomeCompleto}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
        />

        <input
          name="nomeArtistico"
          type="text"
          placeholder="Nome artístico"
          value={formData.nomeArtistico}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
        />

        <input
          name="cpf"
          type="text"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
        />

        <input
          name="dataNascimento"
          type="date"
          value={formData.dataNascimento}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-zinc-900 text-white focus:outline-none"
        />

        <button
          type="submit"
          className="
          mt-4
          px-6 py-3
          rounded-lg
          bg-orange-500
          text-black
          font-medium
          hover:bg-orange-600
        "
        >
          Adicionar Bailarino
        </button>
      </form>
    </div>
  );
}
