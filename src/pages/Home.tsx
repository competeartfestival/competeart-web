import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <button
        onClick={() => {
          if (!videoRef.current) return;

          videoRef.current.muted = !muted;
          videoRef.current.volume = 0.4;
          setMuted(!muted);
        }}
        className="
    absolute top-5 left-5
    z-20
    p-3
    rounded-full
    bg-black/80
    text-white
    hover:bg-black/80
    transition
  "
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        muted={muted}
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/bg-video.mp4" type="video/mp4" />
      </video>

      <div
        className="
      absolute inset-0
      bg-black/80
      backdrop-blur-sm
      -z-10
    "
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center text-center gap-6">
          <img
            src="/assets/logo.png"
            alt="Compete'Art"
            className="w-48 md:w-56 lg:w-64 drop-shadow-lg"
          />

          <p className="font-secondary text-base text-gray-300 max-w-md leading-relaxed">
            Inscrições abertas para escolas e bailarinos independentes. Uma
            celebração de arte, movimento e performance.
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
            Começar
          </button>
        </div>
      </div>
    </section>
  );
}
