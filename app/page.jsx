export default function Home() {
    return (
      <main className="p-8 max-w-2xl mx-auto my-10 font-sans">
        <h1 className="text-3xl font-bold mb-4">FlyRank Next.js App</h1>
        <p className="text-gray-600 mb-4">Scaffolded Next.js Application deployed successfully.</p>
        <a href="/health" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Check Health Status
        </a>
      </main>
    );
  }