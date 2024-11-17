import React from "react";

const QRCodeTemplate = ({
  businessName,
  accountName,
  bankName,
  qrCodeUrl,
}: {
  businessName: string;
  accountName: string;
  bankName: string;
  qrCodeUrl: string;
}) => {
  return (
    <div className="w-[800px] h-[400px] bg-white p-8 flex border border-gray-200 rounded-lg">
      {/* Left Column - Branding and Text */}
      <div className="flex-1 flex flex-col justify-between pr-8 border-r border-gray-200">
        <div className="space-y-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl">
              P2P
            </div>
            <span className="text-2xl font-bold text-gray-900">PaySender</span>
          </div>

          {/* Main Text */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Merchant <br />
              <span className="text-blue-600">QR Code</span>
            </h2>
            <p className="text-xl text-gray-600">
              Making payments easier and faster
            </p>
          </div>

          {/* Business Details */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {businessName}
            </p>
            <p className="text-gray-600">{accountName}</p>
            <p className="text-gray-600">{bankName}</p>
          </div>
        </div>

        {/* Powered By Footer */}
        <div>
          <p className="text-sm text-gray-500">
            Powered by PaySender • Secure Crypto Payments
          </p>
        </div>
      </div>

      {/* Right Column - QR Code */}
      <div className="flex-1 flex flex-col items-center justify-center pl-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <img
            src={`http://localhost:3000${qrCodeUrl}`}
            alt="Business QR Code"
            className="w-64 h-64"
          />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-900">Scan to Pay</p>
      </div>
    </div>
  );
};

export default QRCodeTemplate;
