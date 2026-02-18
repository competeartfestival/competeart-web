import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obterResumo } from "../lib/api";

import { useNavigate } from "react-router-dom";

export default function Resumo() {
  const { escolaId } = useParams();
  const [resumo, setResumo] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (escolaId) {
      obterResumo(escolaId).then(setResumo);
    }
  }, [escolaId]);

  if (!resumo) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        Carregando resumo...
      </main>
    );
  }
  const faltam = resumo.escola.limiteCoreografias - resumo.totais.coreografias;
  const href =
    "https://wa.me/5511942410119?text=" +
    encodeURIComponent(
      "Olá, represento a escola " +
        resumo.escola.nome +
        " e gostaria de confirmar minha inscrição com o valor de R$" +
        resumo.valores.total +
        " no festival Compete’Art",
    );

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white mb-6"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-primary text-orange-500 mb-6">
        Resumo da Inscrição
      </h1>

      <section className="mb-6">
        <h2 className="font-secondary font-semibold mb-2">Escola</h2>
        <p>{resumo.escola.nome}</p>
      </section>

      <section className="mb-6">
        <h2 className="font-secondary font-semibold mb-2">Coreografias</h2>

        <ul className="flex flex-col gap-2">
          {resumo.detalhamento.coreografias.map((c: any) => (
            <li key={c.id} className="p-4 rounded bg-zinc-900">
              <p className="font-medium"> {c.nome}</p>
              <p className="text-sm text-gray-400">{c.formacao}</p>
              <p className="text-orange-500 font-semibold">R$ {c.valor}</p>
            </li>
          ))}
        </ul>
        {faltam > 0 && (
          <button
            onClick={() => {
              if (isAdvancing) return;
              setIsAdvancing(true);
              navigate(`/inscricao/${resumo.escola.id}/coreografias`);
            }}
            disabled={isAdvancing}
            className="
      mt-6
      w-full
      px-6 py-3
      rounded-lg
      bg-orange-500
      text-black
      font-extralight
      hover:bg-orange-600
      disabled:opacity-60
      disabled:cursor-not-allowed
    "
          >
            {isAdvancing
              ? "Avançando..."
              : `Adicionar coreografia (${faltam} restante${faltam > 1 ? "s" : ""})`}
          </button>
        )}
      </section>

      <section className="mb-6">
        <h2 className="font-secondary font-semibold mb-2">Totais</h2>

        <div className="flex justify-between text-sm">
          <span>Coreografias</span>
          <span>R$ {resumo.valores.coreografias}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Assistentes extras</span>
          <span>R$ {resumo.valores.assistentesExtras}</span>
        </div>

        <div className="flex justify-between text-lg font-bold mt-4">
          <span>Total</span>
          <span className="text-orange-500">R$ {resumo.valores.total}</span>
        </div>
      </section>
      <div>
        <p className="text-sm text-gray-400">
          O pagamento será realizado fora da plataforma. Confirme sua inscrição
          abaixo pelo WhatsApp.
        </p>
      </div>

      <a
        href={href}
        onClick={() => setIsConfirming(true)}
        className="
      mt-6
      w-full
      px-6 py-3
      rounded-lg
      bg-orange-500
      text-black
      font-medium
      hover:bg-orange-600
      flex
      justify-center
      items-center
      no-underline
      transition
    "
        style={{
          pointerEvents: isConfirming ? "none" : "auto",
          opacity: isConfirming ? 0.6 : 1,
          cursor: isConfirming ? "not-allowed" : "pointer",
        }}
      >
        <span className="font-extralight flex">
          <img className="w-auto h-5 mr-2" src="/assets/whatsapp.png" />
          {isConfirming ? "Concluindo..." : "Confirmar minha inscrição"}
        </span>
      </a>
    </main>
  );
}
