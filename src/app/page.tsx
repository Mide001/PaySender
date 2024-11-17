import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-2xl mx-auto py-8 px-4">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          {/* Hero Section */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Accept USDC Payments
                <span className="text-blue-600"> Seamlessly</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Transform your business with instant crypto payments. Get
                started in minutes with our simple QR code solution.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/register">
                  <button className="group flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200">
                    Get Started
                    <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </button>
                </Link>
                <button className="px-6 py-3 text-lg font-semibold text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <div className="w-6 h-6 border-2 border-blue-600 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      Simple QR Setup
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Generate your unique QR code instantly and start accepting
                      payments
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <div className="w-6 h-6 border-2 border-blue-600 rounded-lg relative">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600"></div>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      Instant USDC Payments
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Receive stable USDC payments directly to your wallet
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <div className="w-6 h-6 border-2 border-blue-600 rounded-full relative">
                        <div className="absolute inset-1 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      Secure & Reliable
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Built with enterprise-grade security for your peace of
                      mind
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-600 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Ready to modernize your payment system?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join the growing network of businesses accepting USDC payments
              </p>
              <button className="mt-8 px-6 py-3 text-lg font-semibold bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200">
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
