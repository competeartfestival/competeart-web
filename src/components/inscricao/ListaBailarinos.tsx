interface ListaBailarinosProps {
  bailarinos: Array<{ id: string; nomeArtistico?: string; nomeCompleto: string }>;
  carregando: boolean;
}

export default function ListaBailarinos({
  bailarinos,
  carregando,
}: ListaBailarinosProps) {
  if (carregando) {
    return <p className="mt-6 text-gray-400">Carregando bailarinos...</p>;
  }

  return (
    <div className="mt-8">
      <p className="mb-3 text-sm text-gray-300">Bailarinos cadastrados:</p>
      <ul className="grid md:grid-cols-2 gap-2">
        {bailarinos.map((bailarino) => (
          <li
            key={bailarino.id}
            className="px-4 py-2 rounded bg-zinc-900 text-sm border border-zinc-800"
          >
            {bailarino.nomeArtistico || bailarino.nomeCompleto}
          </li>
        ))}
      </ul>
    </div>
  );
}
