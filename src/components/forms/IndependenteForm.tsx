import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarIndependente } from "../../lib/api";

type FormData = {
  nomeResponsavel: string;
  email: string;
  whatsapp: string;
  limiteCoreografias: number;
};

export default function IndependenteForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nomeResponsavel: "",
    email: "",
    whatsapp: "",
    limiteCoreografias: 1,
  });
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    e.preventDefault();
    setErroGeral(null);
    setErrosCampo({});

    const novosErros: Record<string, string> = {};

    if (!formData.nomeResponsavel.trim()) {
      novosErros.nomeResponsavel = "Informe o seu nome completo.";
    }

    if (!formData.email.trim()) {
      novosErros.email = "Informe o e-mail.";
    }

    if (!formData.whatsapp.trim()) {
      novosErros.whatsapp = "Informe o WhatsApp.";
    }

    if (formData.limiteCoreografias < 1) {
      novosErros.limiteCoreografias = "Informe pelo menos 1 coreografia.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampo(novosErros);
      return;
    }

    try {
      setIsSubmitting(true);
      const resultado = await criarIndependente(formData);
      navigate(`/independentes/${resultado.id}/elenco`);
    } catch (error: any) {
      setErroGeral(error?.message || "Erro ao criar inscrição independente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
      {erroGeral && (
        <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
          {erroGeral}
        </div>
      )}

      <input
        name="nomeResponsavel"
        type="text"
        placeholder="Nome do bailarino"
        value={formData.nomeResponsavel}
        onChange={handleChange}
        className="px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
      />
      {errosCampo.nomeResponsavel && (
        <p className="text-sm text-red-400">{errosCampo.nomeResponsavel}</p>
      )}

      <input
        name="email"
        type="email"
        placeholder="E-mail"
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

      <label> Quantidade de coreografias:</label>
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
      {errosCampo.limiteCoreografias && (
        <p className="text-sm text-red-400">{errosCampo.limiteCoreografias}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 px-6 py-3 bg-orange-500 text-black font-medium transition-colors hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Avancando..." : "Avancar"}
      </button>
    </form>
  );
}
