interface ToastAvisoProps {
  mensagem: string;
}

export default function ToastAviso({ mensagem }: ToastAvisoProps) {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
      <div className="px-6 py-3 rounded-lg bg-zinc-900 border border-orange-500 text-sm text-orange-400 shadow-lg">
        {mensagem}
      </div>
    </div>
  );
}
