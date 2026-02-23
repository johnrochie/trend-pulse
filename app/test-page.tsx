export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Test Page</h1>
        <p className="text-gray-300">If you can see this, the routing is working.</p>
        <p className="text-green-400 mt-4">No 404 errors should appear.</p>
      </div>
    </div>
  );
}