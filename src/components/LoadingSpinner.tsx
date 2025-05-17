import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin border-t-blue-600" />
    </div>
  );
}