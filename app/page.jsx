'use client';

import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (shouldFail = false) => {
    setLoading(true);
    setError(null);
    try {
      if (shouldFail) {
        throw new Error('Mid-stream API interruption / Rate limit exceeded.');
      }
      // Simulated stream latency
      await new Promise((res) => setTimeout(res, 1200));
      setData('AI Processing Stream Completed Successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto my-10 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">FlyRank Resilience & Error Test</h1>

      {/* 1. First-Run Empty State */}
      {!data && !loading && !error && (
        <div className="p-6 border border-dashed border-gray-300 rounded-xl text-center bg-gray-50 mb-6">
          <p className="text-gray-600 mb-4">No active stream found. Trigger an AI flow below to test resilience.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => fetchData(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Start Happy Path
            </button>
            <button
              onClick={() => fetchData(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
            >
              Simulate Failure
            </button>
          </div>
        </div>
      )}

      {/* 2. Loading Skeleton State */}
      {loading && (
        <div className="animate-pulse space-y-3 p-6 border rounded-xl mb-6">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      )}

      {/* 3. Error State with Retry */}
      {error && (
        <div className="p-6 border border-red-200 bg-red-50 rounded-xl mb-6">
          <p className="text-red-700 font-medium mb-1">Stream Interrupted</p>
          <p className="text-xs text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchData(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Retry Stream
          </button>
        </div>
      )}

      {/* 4. Success State */}
      {data && (
        <div className="p-6 border border-green-200 bg-green-50 rounded-xl mb-6">
          <p className="text-green-800 font-semibold">{data}</p>
          <button
            onClick={() => setData(null)}
            className="mt-4 text-xs text-gray-500 underline"
          >
            Reset Test
          </button>
        </div>
      )}
    </main>
  );
}