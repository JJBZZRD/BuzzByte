export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-foreground/20 border-r-2 border-b-2 border-l-2"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-l-2 border-b-2 border-foreground animate-spin"></div>
        </div>
        <p className="mt-4 text-foreground/70">Loading...</p>
      </div>
    </div>
  );
} 