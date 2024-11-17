"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Banknote, Clipboard, Check, Landmark, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

interface BusinessData {
  businessName: string;
  bankName: string;
  accountNumber: string;
  walletAddress: string;
}

type PaymentMethod = "bank" | "wallet" | null;

const NAIRA_TO_USDC_RATE = 1 / 1709.15;

const Payment: NextPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { address } = useAccount();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [nairaAmount, setNairaAmount] = useState("");
  const [usdcEquivalent, setUsdcEquivalent] = useState("0");
  const [nairaEquivalent, setNairaEquivalent] = useState("0");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(null);

  const [isWalletLoading, setIsWalletLoading] = useState(true);

  useEffect(() => {
    if (address === undefined) {
      setIsWalletLoading(false);
    } else {
      setIsWalletLoading(false);
    }
  }, [address]);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const data = searchParams.get("data");

        if (!data) {
          setLoading(false);
          setError("No business data available");
          return;
        }

        const encodedData = data.replace(/-/g, "+").replace(/_/g, "/");

        const response = await fetch(`/api/verify-business/${encodedData}`);
        const responseData = await response.json();

        if (!response.ok) throw new Error(responseData.error);

        setBusinessData(responseData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessData();
  }, [searchParams]);

  const handleNairaAmountChange = (value: string) => {
    // Allow only numbers and up to 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setNairaAmount(value);
      const numericValue = parseFloat(value) || 0;
      const usdcAmount = (numericValue * NAIRA_TO_USDC_RATE).toLocaleString(
        "en-US",
        {
          maximumFractionDigits: 6,
          minimumFractionDigits: 2,
        }
      );
      setUsdcEquivalent(usdcAmount);
    }
  };

  const copyToClipboard = async (text: string, type: "wallet" | "account") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "wallet") {
        setCopiedWallet(true);
        setTimeout(() => setCopiedWallet(false), 2000);
      } else {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSuccessfulPayment = (paymentDetails: any) => {
    const params = new URLSearchParams({
      amount: nairaAmount,
      businessName: businessData ? businessData.businessName : "",
      paymentMethod: selectedPaymentMethod || "",
      txId: "transaction-id-here",
    });

    router.push(`/payment/success?${params.toString()}`);
  };

  if (loading) {
    return (
      <div>
        <nav className="w-full bg-white border-b border-gray-200 fixed top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-12 h-10 rounded-lg bg-blue-600 text-white font-bold text-xl">
                  P2P
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  PaySender
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-50 py-2 px-3 rounded-lg">
                  <span className="text-sm">Secure Payment</span>
                  <span className="text-blue-600">🔒</span>
                </div>
                <ConnectButton
                  label="Sign In"
                  accountStatus="avatar"
                  showBalance={false}
                />
              </div>
            </div>
          </div>
        </nav>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <span className="text-gray-600">Loading payment details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
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

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-50 py-2 px-3 rounded-lg">
                  <span className="text-sm">Secure Payment</span>
                  <span className="text-blue-600">🔒</span>
                </div>
                <ConnectButton
                  label="Sign In"
                  accountStatus="avatar"
                  showBalance={false}
                />
              </div>
            </div>
          </div>
        </nav>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-md w-full mx-4 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p>Error: {error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!businessData) {
    return (
      <>
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

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-50 py-2 px-3 rounded-lg">
                  <span className="text-sm">Secure Payment</span>
                  <span className="text-blue-600">🔒</span>
                </div>
                <ConnectButton
                  label="Sign In"
                  accountStatus="avatar"
                  showBalance={false}
                />
              </div>
            </div>
          </div>
        </nav>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-yellow-50 text-yellow-600 p-6 rounded-xl max-w-md w-full mx-4 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p>No business data available</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Payment to {businessData.businessName}</title>
        <meta name="description" content="Payment page" />
      </Head>

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

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-50 py-2 px-3 rounded-lg">
                <span className="text-sm">Secure Payment</span>
                <span className="text-blue-600">🔒</span>
              </div>
              <ConnectButton
                label="Sign In"
                accountStatus="avatar"
                showBalance={false}
              />
            </div>
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-gray-50 pt-8">
        <main className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏢</span>
                <h1 className="text-2xl font-bold">
                  {businessData.businessName}
                </h1>
              </div>
              <p className="text-blue-100">
                Please review the payment details below
              </p>
            </div>

            <div className="p-6 space-y-8">
              {/* Amount Input Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <Banknote />
                  <h3 className="text-lg font-medium">Amount to Send</h3>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={nairaAmount}
                      onChange={(e) => handleNairaAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      NGN
                    </span>
                  </div>

                  {/* Conversion Rate Display */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="text-base">🔄</span>
                        Current Rate
                      </span>
                      <span>
                        ₦{(1 / NAIRA_TO_USDC_RATE).toLocaleString()} = 1 USDC
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span>USDC Equivalent</span>
                      <span className="text-lg">{usdcEquivalent} USDC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <input
                    type="radio"
                    id="bankPayment"
                    name="paymentMethod"
                    value="bank"
                    checked={selectedPaymentMethod === "bank"}
                    onChange={(e) => setSelectedPaymentMethod("bank")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Landmark />
                  <h3 className="text-lg font-medium">Direct To Bank</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                    <p className="font-medium">{businessData.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium font-mono">
                        {businessData.accountNumber}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(businessData.accountNumber, "account")
                        }
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        {copiedAccount ? <Check /> : <Clipboard />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <input
                    type="radio"
                    id="walletPayment"
                    name="paymentMethod"
                    value="wallet"
                    checked={selectedPaymentMethod === "wallet"}
                    onChange={(e) => setSelectedPaymentMethod("wallet")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Wallet />
                  <h3 className="text-lg font-medium">
                    Onboard Wallet Address
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-sm break-all">
                      {businessData.walletAddress}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(businessData.walletAddress, "wallet")
                      }
                      className="p-1.5 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0"
                    >
                      {copiedWallet ? <Check /> : <Clipboard />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                  nairaAmount &&
                  selectedPaymentMethod &&
                  address &&
                  !isWalletLoading
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (nairaAmount && selectedPaymentMethod && address) {
                    handleSuccessfulPayment({
                      amount: nairaAmount,
                      paymentMethod: selectedPaymentMethod,
                    });
                  }
                }}
                disabled={
                  !nairaAmount ||
                  !selectedPaymentMethod ||
                  !address ||
                  isWalletLoading
                }
              >
                {isWalletLoading ? (
                  "Checking wallet connection..."
                ) : !address ? (
                  "Please connect wallet"
                ) : !selectedPaymentMethod ? (
                  "Select payment method"
                ) : !nairaAmount ? (
                  "Enter amount"
                ) : (
                  <>
                    Continue to Payment
                    <span className="text-base">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payment;
