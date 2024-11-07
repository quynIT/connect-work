import React from "react";

export default function NoPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="text-8xl mb-4">
          <span role="img" aria-label="sad face">
            😢
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Page not found!</h1>
        <p className="text-gray-600 mt-2">
          Sorry, we couldn't find the page you are looking for.
        </p>
        <div className="mt-4">
          <a href="/" className="text-blue-500 hover:underline">
            Homepage
          </a>
          <span className="mx-2">·</span>
          <a href="/roadmaps" className="text-blue-500 hover:underline">
            Roadmaps
          </a>
          <span className="mx-2">·</span>
          <a href="/best-practices" className="text-blue-500 hover:underline">
            Best Practices
          </a>
        </div>
      </div>
    </div>
  );
}
