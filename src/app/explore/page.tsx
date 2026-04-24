export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const unresolvedSearchParams = await searchParams;
  const q = unresolvedSearchParams.q;

  return (
    <main className="w-full min-h-[70vh] px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-black italic tracking-tighter uppercase mb-4">
          Explore.
        </h1>
        {q ? (
          <p className="text-xl">
            Mostrando resultados para: <strong className="font-sans border-b-2 border-foreground">{q}</strong>
          </p>
        ) : (
          <p className="text-xl">
            Utilize a busca no menu para garimpar peças específicas.
          </p>
        )}
        
        {/* Fututo Grid de Resultados de Pesquisa aqui */}
        <div className="w-full h-64 border-[2px] border-foreground border-dashed mt-12 flex items-center justify-center font-bold uppercase tracking-widest text-foreground/50">
          Resultados renderizarão aqui futuramente.
        </div>
      </div>
    </main>
  );
}
