import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Vídeo de background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="
      absolute inset-0
      w-full h-full
      object-cover
      -z-10
    "
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div
        className="
      absolute inset-0
      bg-black/80
      backdrop-blur-sm
      -z-10
    "
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center text-center gap-6">
          <img
            src="/assets/logo.png"
            alt="Compete'Art"
            className="w-48 md:w-56 lg:w-64 drop-shadow-lg"
          />

          <p className="font-secondary text-base text-gray-300 max-w-md leading-relaxed">
            Inscrições abertas para escolas e grupos de dança. Uma celebração de
            arte, movimento e performance.
          </p>

          <button
            onClick={() => navigate("/inscricao")}
            className="
          mt-4
          px-8 py-4
          rounded-lg
          bg-orange-500
          text-black
          font-semibold
          hover:bg-orange-600
          transition
        "
          >
            Inscrever minha escola
          </button>
        </div>
      </div>
    </section>
  );
}
