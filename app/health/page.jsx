export default async function HealthPage() {
    return (
      <div className="p-8 max-w-md mx-auto my-10 bg-white rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold mb-4 text-green-600">System Status: Healthy</h1>
        <p className="text-gray-600">Application scaffolded and deployed successfully.</p>
      </div>
    );
  }