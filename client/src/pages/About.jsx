import React from "react";

export default function About() {
  return (
    <div className="mt-10 min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Transforming Waste Management with AI
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We're on a mission to revolutionize waste segregation through intelligent technology 
          and environmental education.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="space-y-4 p-8 rounded-lg bg-green-50">
            <h2 className="text-3xl font-bold text-gray-800">🌱 Our Mission</h2>
            <p className="text-gray-600">
              To empower individuals and communities with smart tools that simplify 
              waste segregation and promote sustainable living practices.
            </p>
          </div>
          <div className="space-y-4 p-8 rounded-lg bg-blue-50">
            <h2 className="text-3xl font-bold text-gray-800">♻️ Our Vision</h2>
            <p className="text-gray-600">
              A world where every piece of waste is properly sorted, recycled, 
              and diverted from landfills through accessible technology.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Technology
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">AI Classification</h3>
              <p className="text-gray-600">
                Advanced computer vision models trained on thousands of waste items 
                for accurate categorization
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Real-Time Analysis</h3>
              <p className="text-gray-600">
                Instant processing with detailed disposal guidelines and recycling options
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sustainability Metrics</h3>
              <p className="text-gray-600">
                Track your environmental impact and learn ways to reduce waste generation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Environmental Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl text-green-600 mb-4">1M+</div>
              <h3 className="text-xl font-semibold mb-2">Items Classified</h3>
              <p className="text-gray-600">Since our launch</p>
            </div>
            <div className="p-6">
              <div className="text-4xl text-green-600 mb-4">85%</div>
              <h3 className="text-xl font-semibold mb-2">Accuracy Rate</h3>
              <p className="text-gray-600">Across waste categories</p>
            </div>
            <div className="p-6">
              <div className="text-4xl text-green-600 mb-4">500+</div>
              <h3 className="text-xl font-semibold mb-2">Local Guidelines</h3>
              <p className="text-gray-600">Tailored disposal recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Commitments
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🌍 Sustainability First</h3>
              <p className="text-gray-600">
                Every feature is designed with environmental impact in mind
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">📚 Continuous Education</h3>
              <p className="text-gray-600">
                Regular updates with the latest recycling practices and regulations
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🤝 Community Focus</h3>
              <p className="text-gray-600">
                Partnering with local organizations to maximize real-world impact
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}