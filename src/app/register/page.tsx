"use client";
import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import { ChevronDown, Clipboard, Download, Link } from "lucide-react";
import banksData from "@/utils/banks";

interface FormData {
  businessName: string;
  bankName: string;
  accountNumber: string;
  walletAddress: string;
}

interface QRCodeResponse {
  filename: string;
  qrCodeUrl: string;
  paymentUrl: string;
  encodedData: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

const Register: React.FC = () => {
  const sortedBanks = [...banksData.data].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const [banks, setBanks] = useState(banksData.data);
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    bankName: "",
    accountNumber: "",
    walletAddress: "",
  });

  const [selectedBankCode, setSelectedBankCode] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = useState<QRCodeResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");

  const verifyAccount = useCallback(
    async (accountNumber: string, bankCode: string) => {
      if (!accountNumber || !bankCode || accountNumber.length !== 10) return;

      setIsVerifying(true);
      setVerificationError("");
      setAccountName("");

      try {
        const response = await fetch("/api/verify-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_number: accountNumber,
            bank_code: bankCode,
          }),
        });

        const data = await response.json();

        if (data.status === true && data.data?.account_name) {
          setAccountName(data.data.account_name);
        } else {
          setVerificationError(data.message || "Could not verify account");
        }
      } catch (error) {
        setVerificationError("Error verifying account. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    []
  );

  const handleBankSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>): void => {
      const bankCode = e.target.value;
      const selectedBank = sortedBanks.find((bank) => bank.code === bankCode);

      setSelectedBankCode(bankCode);
      setFormData((prev) => ({
        ...prev,
        bankName: selectedBank?.name || "",
      }));

      if (!bankCode) {
        setAccountName("");
      }
    },
    [sortedBanks]
  );

  const validateForm = (): boolean => {
    if (formData.businessName.length < 2) {
      setError("Business name must be at least 2 characters long");
      return false;
    }
    if (formData.accountNumber.length < 10) {
      setError("Account number must be at least 10 characters long");
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      setError(
        "Invalid Ethereum wallet address. Must start with 0x followed by 40 hexadecimal characters"
      );
      return false;
    }
    return true;
  };

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = e.target;

      if (name === "accountNumber" && value.length > 10) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "accountNumber" && value.length !== 10) {
        setAccountName("");
        setVerificationError("");
      }

      setError("");
    },
    []
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-business-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate QR code");
      }

      setQrCodeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, message: string): void => {
    navigator.clipboard.writeText(text);
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleDownload = async (
    url: string,
    filename: string
  ): Promise<void> => {
    let objectUrl: string | null = null;

    try {
      setLoading(true);

      // First load the QR code image and convert to base64
      const loadQRCode = async (): Promise<string> => {
        const qrResponse = await fetch(`${BASE_URL}${url}`);
        if (!qrResponse.ok) {
          throw new Error("Failed to fetch QR code image");
        }
        const qrBlob = await qrResponse.blob();

        // Wait for QR code to load
        return new Promise((resolve, reject) => {
          const qrImg = document.createElement("img");
          qrImg.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = qrImg.width;
            canvas.height = qrImg.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }
            ctx.drawImage(qrImg, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          };
          qrImg.onerror = () =>
            reject(new Error("Failed to load QR code image"));
          qrImg.src = URL.createObjectURL(qrBlob);
        });
      };

      // Load the QR code first
      const qrBase64 = await loadQRCode();

      // Fetch and validate SVG template
      const templateResponse = await fetch("/assets/qr-template.svg");
      if (!templateResponse.ok) {
        throw new Error("Failed to fetch SVG template");
      }

      let svgText = await templateResponse.text();
      if (
        !svgText.includes("BUSINESS_NAME") ||
        !svgText.includes('id="qrCode"')
      ) {
        throw new Error("Invalid SVG template format");
      }

      // Replace placeholders
      const businessName = formData.businessName.trim().toUpperCase();
      if (!businessName) {
        throw new Error("Business name is required");
      }

      svgText = svgText
        .replace(/BUSINESS_NAME/g, businessName)
        .replace(
          /<image id="qrCode"[^>]*>/,
          `<image id="qrCode" x="32" y="32" width="256" height="256" href="${qrBase64}" preserveAspectRatio="xMidYMid meet"/>`
        );

      // Create final image
      const finalImage = document.createElement("img");

      // Convert SVG to data URL
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
      objectUrl = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve, reject) => {
        finalImage.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 800;
            canvas.height = 400;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              throw new Error("Failed to get canvas context");
            }

            // Draw the complete image
            ctx.drawImage(finalImage, 0, 0, canvas.width, canvas.height);

            // Create download link
            const link = document.createElement("a");
            link.download = `${filename.replace(
              /[^a-z0-9]/gi,
              "_"
            )}-qr-code.png`;
            link.href = canvas.toDataURL("image/png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            resolve();
          } catch (error) {
            reject(error);
          }
        };

        finalImage.onerror = () =>
          reject(new Error("Failed to load final image"));
        finalImage.src = objectUrl || "";
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate QR code image"
      );
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.accountNumber.length === 10 && selectedBankCode) {
        verifyAccount(formData.accountNumber, selectedBankCode);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.accountNumber, selectedBankCode, verifyAccount]);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-gray-500 bg-gray-50 py-2 px-3 rounded-lg">
                <span className="text-sm">Secure Payment</span>
                <span className="text-blue-600">🔒</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center">
                Generate Your Business QR Code
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter your business name (min. 2 characters)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bankSelect"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Name
                </label>
                <div className="relative">
                  <select
                    id="bankSelect"
                    name="bankSelect"
                    value={selectedBankCode}
                    onChange={handleBankSelect}
                    className="w-full pl-3 pr-10 py-2.5 text-base bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Select a bank
                    </option>
                    {banks.map((bank) => (
                      <option
                        key={bank.id}
                        value={bank.code}
                        className="text-gray-900"
                      >
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="absolute inset-0 rounded-md pointer-events-none ring-1 ring-gray-300 ring-opacity-50"></div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your account number (min. 10 characters)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {isVerifying && (
                <div className="text-sm text-gray-500">
                  Verifying account...
                </div>
              )}
              {accountName && (
                <div className="text-sm text-green-600 font-medium">
                  {accountName}
                </div>
              )}
              {verificationError && (
                <div className="text-sm text-red-600">{verificationError}</div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="walletAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Onboard Wallet Address
                  </label>
                  <div className="relative group">
                    <div className="w-4 h-4 text-gray-400 cursor-help">ⓘ</div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10">
                      Your Onboard wallet address where you will receive
                      USDC/cNGN payments. Must start with &apos;0x&apos;
                      followed by 40 hexadecimal characters. Please double-check
                      the address as transactions cannot be reversed.
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  placeholder="0x... (Onboard wallet address)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Generating QR Code...
                  </span>
                ) : (
                  "Generate QR Code"
                )}
              </button>
            </form>

            {qrCodeData && (
              <div className="mt-6 space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="text-center mb-4 font-medium">
                    Your QR Code
                  </div>
                  <div className="flex justify-center">
                    <Image
                      src={`${BASE_URL}${qrCodeData.qrCodeUrl}`}
                      alt="Business QR Code"
                      width={192}
                      height={192}
                      unoptimized
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded">
                    <div className="truncate flex-1">
                      <span className="text-sm text-gray-600">
                        Payment URL:
                      </span>
                      <div className="text-sm truncate">
                        {`${BASE_URL}${qrCodeData.paymentUrl}`}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${BASE_URL}${qrCodeData.paymentUrl}`,
                          "Payment URL copied!"
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Clipboard />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleDownload(
                          qrCodeData.qrCodeUrl,
                          formData.businessName
                        )
                      }
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                          <span>Preparing Download...</span>
                        </>
                      ) : (
                        <>
                          <Download /> Download QR Code
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `${BASE_URL}${qrCodeData.qrCodeUrl}`,
                          "_blank"
                        )
                      }
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Link /> View Full Size
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simple toast notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Register;
