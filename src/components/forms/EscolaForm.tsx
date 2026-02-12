import { useState } from "react";
import { criarEscola } from "../../lib/api";
import { useNavigate } from "react-router-dom";

type Profissional = {
  nome: string;
  funcao: "COREOGRAFO" | "ASSISTENTE";
  ehExtra: boolean;
};

type EscolaFormData = {
  nome: string;
  endereco: string;
  email: string;
  whatsapp: string;
  nomeDiretor: string;
  limiteCoreografias: number;
  profissionais: Profissional[];
};

export default function EscolaForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EscolaFormData>({
    nome: "",
    endereco: "",
    email: "",
    whatsapp: "",
    nomeDiretor: "",
    limiteCoreografias: 0,
    profissionais: [],
  });

  function adicionarProfissional() {
    const assistentes = formData.profissionais.filter(
      (p) => p.funcao === "ASSISTENTE",
    );

    const novoProfissional: Profissional = {
      nome: "",
      funcao: "ASSISTENTE",
      ehExtra: assistentes.length >= 2,
    };

    setFormData((prev) => ({
      ...prev,
      profissionais: [...prev.profissionais, novoProfissional],
    }));
  }

  function atualizarProfissional(
    index: number,
    campo: keyof Profissional,
    valor: string,
  ) {
    setFormData((prev) => {
      const profissionais = [...prev.profissionais];

      profissionais[index] = {
        ...profissionais[index],
        [campo]: valor,
      };

      return { ...prev, profissionais };
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "limiteCoreografias" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.limiteCoreografias < 1) {
      alert("Informe pelo menos 1 coreografia.");
      return;
    }
    try {
      const resultado = await criarEscola(formData);
      navigate(`/inscricao/${resultado.id}/elenco`);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar escola");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
      <input
        name="nome"
        type="text"
        placeholder="Nome da escola"
        value={formData.nome}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />

      <input
        name="endereco"
        type="text"
        placeholder="Endereço completo"
        value={formData.endereco}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />

      <input
        name="email"
        type="email"
        placeholder="E-mail da escola"
        value={formData.email}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />

      <input
        name="whatsapp"
        type="tel"
        placeholder="WhatsApp"
        value={formData.whatsapp}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />

      <input
        name="nomeDiretor"
        type="text"
        placeholder="Nome do(a) diretor(a)"
        value={formData.nomeDiretor}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />

      <span className="mt-6">Quantidade de coreografias: </span>
      <input
        name="limiteCoreografias"
        type="number"
        min={1}
        placeholder="Quantidade de coreografias"
        value={formData.limiteCoreografias}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />

      <div className="mt-6 flex flex-col gap-4">
        <h3 className="font-secondary font-semibold">Profissionais</h3>

        {formData.profissionais.map((profissional, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-4 rounded-md bg-zinc-900"
          >
            <input
              type="text"
              placeholder="Nome do profissional"
              value={profissional.nome}
              onChange={(e) =>
                atualizarProfissional(index, "nome", e.target.value)
              }
              className="px-3 py-2 rounded bg-zinc-800 text-white focus:outline-none"
            />

            <select
              value={profissional.funcao}
              onChange={(e) =>
                atualizarProfissional(index, "funcao", e.target.value)
              }
              className="px-3 py-2 rounded bg-zinc-800 text-white focus:outline-none"
            >
              <option value="COREOGRAFO">Coreógrafo(a)</option>
              <option value="ASSISTENTE">Assistente</option>
            </select>

            {profissional.funcao === "ASSISTENTE" && profissional.ehExtra && (
              <p className="text-sm text-orange-400">
                Assistente extra (R$ 70)
              </p>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={adicionarProfissional}
          className="text-orange-400 text-sm self-start hover:underline"
        >
          + Adicionar profissional
        </button>
      </div>

      <button
        type="submit"
        className="
          mt-4
          px-6 py-3
          rounded-lg
          bg-orange-500
          text-black
          font-medium
          transition-colors
          hover:bg-orange-600
        "
      >
        Avançar
      </button>
    </form>
  );
}
