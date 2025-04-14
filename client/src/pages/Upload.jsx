import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownRenderer from "../components/MarkdownRenderer";
import cleanMarkdown from "../assets/cleanMarkdown";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const API_BASE_URL =
    import.meta.env.VITE_AI_API_BASE_URL || "http://localhost:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) formData.append("image", file);

      const res = await fetch(`${API_BASE_URL}/backend/ai/waste/classify`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Classification failed");
      }

      const data = await res.json();
      console.log(data);
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen bg-gray-50">
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="mb-10 text-center space-y-4">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-sm">
            <span className="text-5xl">🗑️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Waste Classification
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a photo of waste material to get classification and disposal
            recommendations
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Waste Image
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-600 file:mr-4 
                      file:py-2.5 file:px-6 file:rounded-lg file:border-0 
                      file:text-sm file:font-medium file:bg-green-50 
                      file:text-green-700 hover:file:bg-green-100 transition-colors"
                  />
                </div>
                {file && (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="px-3 py-2.5 text-red-600 hover:text-red-700 
                      rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !file}
                className={`w-full py-3.5 px-6 text-sm font-medium rounded-lg 
                  transition-all duration-200 ${
                    isLoading || !file
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  "Classify Waste"
                )}
              </button>
            </div>
          </form>
        </div>

        {response && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="space-y-4">
              {/* Waste Type */}
              <div className="pb-4 border-b border-gray-100">
                <b className="text-center text-3xl text-green-500">
                <MarkdownRenderer
                  content={cleanMarkdown(response.classification)}
                />
                </b>
              </div>

              {/* Materials */}
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Materials
                </h3>
                <MarkdownRenderer content={cleanMarkdown(response.material)} />
              </div>

              {/* Disposal Instructions */}
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Disposal Instructions
                </h3>
                <MarkdownRenderer content={cleanMarkdown(response.disposal)} />
              </div>

              {/* Recycling Tips */}
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Recycling Tips
                </h3>
                <MarkdownRenderer content={cleanMarkdown(response.recycling)} />
              </div>

              {/* Safety Precautions */}
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Safety Precautions
                </h3>
                <MarkdownRenderer content={cleanMarkdown(response.safety)} />
              </div>

              {/* Environmental Impact */}
              {response.environmental && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Environmental Impact
                  </h3>
                  <MarkdownRenderer
                    content={cleanMarkdown(response.environmental)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 mb-8">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}
