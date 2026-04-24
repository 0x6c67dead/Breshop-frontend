import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-[120px] md:text-[200px] font-serif font-black italic leading-none tracking-tighter text-foreground">
        404
      </h1>
      <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-tight">
        LOST IN THE ARCHIVES
      </h2>
      <p className="text-lg md:text-xl mb-12 max-w-md">
        The piece you&apos;re looking for has been snatched up, or the link is broken. 
      </p>
      <Link 
        href="/"
        className="tag-pill bg-accent-orange text-tactile-dark border-[2px] border-tactile-dark px-8 py-4 hard-shadow hover:bg-tactile-light transition-colors text-lg"
      >
        BACK TO FEED
      </Link>
    </div>
  );
}
