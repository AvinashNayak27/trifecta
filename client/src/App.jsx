import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Product Clanker
          </h1>
          <p className="text-2xl mb-8 text-gray-200">
            Launch tokens for trending products on Product Hunt
          </p>
          <a href="/chat" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-all transform hover:scale-105">
            Launch Your Token
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Token Launchpad</h3>
            <p className="text-gray-300">Simply paste a Product Hunt URL and let our AI agent handle the rest</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold mb-2">Trading Platform</h3>
            <p className="text-gray-300">Seamlessly buy and sell tokens with our advanced trading interface</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure Verification</h3>
            <p className="text-gray-300">Powered by Marlin serverless functions and TEEs for trusted identity verification</p>
          </div>
        </div>
      </div>

      {/* AI Token Creation Process */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">AI-Powered Token Creation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🔍</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Data Analysis</h3>
                  <p className="text-gray-300">AI agent analyzes Product Hunt data to determine optimal token parameters</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">⚙️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Automated Deployment</h3>
                  <p className="text-gray-300">One-click token deployment with AI-optimized smart contract generation</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">1.</span>
                  Paste your Product Hunt URL
                </li>
                <li className="flex items-center">
                  <span className="mr-2">2.</span>
                  AI analyzes product data and market metrics
                </li>
                <li className="flex items-center">
                  <span className="mr-2">3.</span>
                  Smart contract parameters are optimized
                </li>
                <li className="flex items-center">
                  <span className="mr-2">4.</span>
                  Token is deployed automatically
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Verification Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Secure Verification Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">⚡</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Marlin Serverless Functions</h3>
                  <p className="text-gray-300">High-performance, decentralized serverless infrastructure for scalable verification processing</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🛡️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Trusted Execution Environments</h3>
                  <p className="text-gray-300">Hardware-level security guarantees for sensitive verification operations</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Verification Process</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">1.</span>
                  Submit identity verification request
                </li>
                <li className="flex items-center">
                  <span className="mr-2">2.</span>
                  Marlin functions process verification in TEE
                </li>
                <li className="flex items-center">
                  <span className="mr-2">3.</span>
                  Secure attestation generation
                </li>
                <li className="flex items-center">
                  <span className="mr-2">4.</span>
                  On-chain verification record
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl mb-8">Join the future of product token trading</p>
          <button className="bg-white text-purple-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all">
            Get Started Now
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;
