'use client';

export default function Logo() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg transform rotate-6 transition-transform hover:rotate-12"></div>
        <div className="absolute inset-0 bg-white rounded-lg transform -rotate-3 transition-transform hover:rotate-0">
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-600">A</span>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Asto
        </h1>
        <p className="text-sm text-gray-500 -mt-1">E-commerce</p>
      </div>
    </div>
  );
} 