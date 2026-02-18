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
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<Record<string, string>>({});

  function adicionarProfissional() {
    setErrosCampo((prev) => {
      const { profissionais, ...rest } = prev;
      return rest;
    });

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
  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "limiteCoreografias" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    setErroGeral(null);
    setErrosCampo({});

    e.preventDefault();
    const novosErros: Record<string, string> = {};

    if (!formData.nome.trim()) {
      novosErros.nome = "Informe o nome da escola.";
    }
    if (!formData.endereco.trim()) {
      novosErros.endereco = "Informe o endereço da escola.";
    }
    if (!formData.email.trim()) {
      novosErros.email = "Informe o e-mail da escola.";
    }
    if (!formData.whatsapp.trim()) {
      novosErros.whatsapp = "Informe o número de WhatsApp da escola.";
    }

    if (!formData.nomeDiretor.trim()) {
      novosErros.nomeDiretor = "Informe o nome do diretor da escola.";
    }

    if (formData.limiteCoreografias < 1) {
      novosErros.limiteCoreografias = "Informe pelo menos 1 coreografia.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampo(novosErros);
      return;
    }
    if (formData.profissionais.length === 0) {
      novosErros.profissionais =
        "Adicione pelo menos um profissional responsável.";
    }
    const profissionalSemNome = formData.profissionais.some(
      (p) => !p.nome.trim(),
    );

    if (profissionalSemNome) {
      novosErros.profissionais = "Preencha o nome de todos os profissionais.";
    }
    if (Object.keys(novosErros).length > 0) {
      setErrosCampo(novosErros);
      return;
    }

    try {
      const resultado = await criarEscola(formData);
      navigate(`/inscricao/${resultado.id}/elenco`);
    } catch (error: any) {
      if (error?.field) {
        setErrosCampo({ [error.field]: error.message });
        return;
      }

      setErroGeral(error?.message || "Erro ao criar escola. Tente novamente.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto mb-12I"
    >
      {erroGeral && (
        <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
          {erroGeral}
        </div>
      )}

      <input
        name="nome"
        type="text"
        placeholder="Nome da escola"
        value={formData.nome}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />
      {errosCampo.nome && (
        <p className="text-sm text-red-400">{errosCampo.nome}</p>
      )}
      <input
        name="endereco"
        type="text"
        placeholder="Endereço completo"
        value={formData.endereco}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />
      {errosCampo.endereco && (
        <p className="text-sm text-red-400">{errosCampo.endereco}</p>
      )}
      <input
        name="email"
        type="email"
        placeholder="E-mail da escola"
        value={formData.email}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />
      {errosCampo.email && (
        <p className="text-sm text-red-400">{errosCampo.email}</p>
      )}
      <input
        name="whatsapp"
        type="tel"
        placeholder="WhatsApp"
        value={formData.whatsapp}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            whatsapp: formatarTelefone(e.target.value),
          }))
        }
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />
      {errosCampo.whatsapp && (
        <p className="text-sm text-red-400">{errosCampo.whatsapp}</p>
      )}

      <input
        name="nomeDiretor"
        type="text"
        placeholder="Nome do(a) diretor(a)"
        value={formData.nomeDiretor}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />
      {errosCampo.nomeDiretor && (
        <p className="text-sm text-red-400">{errosCampo.nomeDiretor}</p>
      )}
      <span className="mt-6">Quantidade de coreografias: </span>
      <input
        name="limiteCoreografias"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Quantidade de coreografias"
        value={formData.limiteCoreografias}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />

      <div
        className="
    mt-6 flex flex-col gap-4"
      >
        <h3 className="font-secondary font-semibold">Profissionais</h3>
        {errosCampo.profissionais && (
          <p className="text-sm text-red-400">{errosCampo.profissionais}</p>
        )}
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
