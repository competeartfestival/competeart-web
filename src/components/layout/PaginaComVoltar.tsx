import type { ReactNode } from "react";

interface PaginaComVoltarProps {
  titulo: string;
  subtitulo?: string;
  aoVoltar: () => void;
  children: ReactNode;
  classeContainer?: string;
}

export default function PaginaComVoltar({
  titulo,
  subtitulo,
  aoVoltar,
  children,
  classeContainer = "max-w-5xl",
}: PaginaComVoltarProps) {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8 md:py-10">
      <div className={`${classeContainer} mx-auto`}>
        <button
          onClick={aoVoltar}
          className="text-sm text-gray-400 hover:text-white mb-6"
        >
          ← Voltar
        </button>

        <header className="mb-6 md:mb-8">
          <h1 className="font-primary text-2xl md:text-3xl text-orange-500 text-left">
            {titulo}
          </h1>
          {subtitulo && <p className="text-gray-400 mt-2">{subtitulo}</p>}
        </header>

        {children}
      </div>
    </main>
  );
}
