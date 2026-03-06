export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-900" aria-busy="true" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}
