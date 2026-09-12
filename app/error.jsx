'use client';

export default function Error({ error, reset }) {
  return (
    <div className="p-8 max-w-md mx-auto text-center my-12 border border-red-200 bg-red-50 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-red-700 mb-2">Application Error</h2>
      <p className="text-sm text-red-600 mb-6">{error?.message || 'A network error occurred mid-stream.'}</p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
      >
        Retry Connection
      </button>
    </div>
  );
}