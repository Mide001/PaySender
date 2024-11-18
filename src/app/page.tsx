"use client"
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Wallet, Building2, CreditCard, Shield, Zap, Globe } from "lucide-react";

const Home: NextPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <main>
        {/* Hero Section with Geometric Background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-blue-500/[0.05] -z-10" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent -z-10" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-blue-500/10 to-transparent -z-10" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-4">
                ✨ Powered by Onboard Wallet
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900">
                Accept Crypto Payments
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"> Seamlessly</span>
              </h1>
              
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
                Start accepting crypto payments in minutes with our simple integration.
                Your gateway to the future of digital transactions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link href="/register">
                  <button className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    Register Business
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </Link>
                
                <a href="https://onboard.money" target="_blank" rel="noopener noreferrer" 
                   className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Get Onboard Wallet
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Section with Hover Effects */}
        <div className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">
              Get Started in <span className="text-blue-600">Three Simple Steps</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Wallet className="w-8 h-8 text-blue-600" />,
                  title: "Download Onboard Wallet",
                  description: "Get started with our trusted partner Onboard Wallet and copy your Ethereum wallet address"
                },
                {
                  icon: <Building2 className="w-8 h-8 text-blue-600" />,
                  title: "Register Your Business",
                  description: "Add your business name, bank details, and wallet address to our platform"
                },
                {
                  icon: <CreditCard className="w-8 h-8 text-blue-600" />,
                  title: "Start Accepting Payments",
                  description: "Your customers can pay directly to your wallet or bank account"
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl" />
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid with Modern Cards */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">
              Why Choose Our <span className="text-blue-600">Platform</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Instant Setup",
                  description: "Get started in minutes with just your business details and wallet address"
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Secure Transactions",
                  description: "Enterprise-grade security powered by Onboard Wallet"
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  title: "Global Payments",
                  description: "Accept payments from customers worldwide"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-200">
                      <div className="text-blue-600">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section with Gradient Background */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
              Ready to modernize your payment system?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join our growing network of businesses accepting crypto payments
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Get Started Now
                </button>
              </Link>
              <a href="#learn-more" className="text-white hover:text-blue-100 transition-colors duration-200">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;