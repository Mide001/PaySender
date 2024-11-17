"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Check, ArrowLeft, Download } from "lucide-react";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transactionDetails, setTransactionDetails] = useState({
    amount: "",
    businessName: "",
    paymentMethod: "",
    transactionId: "",
    timestamp: "",
  });

  useEffect(() => {
    const amount = searchParams.get("amount") || "";
    const businessName = searchParams.get("businessName") || "";
    const paymentMethod = searchParams.get("paymentMethod") || "";
    const transactionId = searchParams.get("txId") || "";
    const timestamp = new Date().toLocaleDateString();

    setTransactionDetails({
      amount,
      businessName,
      paymentMethod,
      transactionId,
      timestamp,
    });
  }, [searchParams]);

  const handleDownloadReceipt = () => {
    alert("Receipt download to be implemented");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Payment Successful</title>
        <meta name="description" content="Payment successful confirmation" />
      </Head>

      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-200 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-xl">
                P2P
              </div>
              <span className="text-lg font-semibold text-gray-900">
                PaySender
              </span>
            </div>
            <ConnectButton
              label="Sign In"
              accountStatus="avatar"
              showBalance={false}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-100">
                Your payment has been processed successfully
              </p>
            </div>

            {/* Transaction Details */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                    <p className="font-medium text-lg">
                      {transactionDetails.amount} cNGN
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium">
                      {transactionDetails.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Paid To</p>
                    <p className="font-medium">
                      {transactionDetails.businessName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                    <p className="font-medium">
                      {transactionDetails.timestamp}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-mono text-sm bg-gray-50 p-3 rounded-lg">
                    {transactionDetails.transactionId}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 font-medium hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return Home
                </button>
                <button
                  onClick={handleDownloadReceipt}
                  className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
