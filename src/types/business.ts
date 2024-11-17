export interface BusinessData {
    [key: string]: string;
    businessName: string;
    bankName: string;
    accountNumber: string;
    walletAddress: string;
};


export interface QRGenerationResult {
    fileName: string;
    qrCodeUrl: string;
    paymentUrl: string;
    encodedData: string;
}

export interface ApiError {
    error: string;
}
