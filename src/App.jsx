import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Copilot Orchestra
            </h1>
            <p className="text-xl text-gray-600">
              Redux + React + Tailwind CSS Setup Complete
            </p>
          </header>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎉 Phase 2 Complete
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Redux store configured with Redux Toolkit
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                React 18 with createRoot
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Tailwind CSS styling active
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom Redux hooks ready
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
