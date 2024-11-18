import qr from "qrcode";
import { Buffer } from 'buffer';

interface BusinessData {
    businessName: string;
    bankName: string;
    accountNumber: string;
    walletAddress: string;
    [key: string]: string;
}

interface QRGenerationResult {
    qrCodeDataUrl: string; 
    paymentUrl: string;
    encodedData: string;
}

export class BusinessQRGenerator {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private encodedData(data: BusinessData): string {
        return Buffer.from(JSON.stringify(data)).toString('base64');
    }

    public async generateBusinessQR(data: BusinessData): Promise<QRGenerationResult> {
        try {
            // Ensure data is an object
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format: expected an object');
            }

            this.validateData(data);

            const businessData: BusinessData = {
                businessName: data.businessName.trim(),
                bankName: data.bankName.trim(),
                accountNumber: data.accountNumber.trim(),
                walletAddress: data.walletAddress.trim(),
            };

            const encodedData = this.encodedData(businessData);
            const paymentUrl = new URL(`${this.baseUrl}/payment`);
            paymentUrl.searchParams.append('data', encodedData);

            // Generate QR code as data URL instead of file
            const qrCodeDataUrl = await qr.toDataURL(paymentUrl.toString(), {
                errorCorrectionLevel: 'H',
                margin: 1,
                width: 300,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                }
            });

            return {
                qrCodeDataUrl,
                paymentUrl: paymentUrl.toString(),
                encodedData,
            };
        } catch (error) {
            console.error('Error in generateBusinessQR:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Unknown error occurred");
        }
    }

    private validateData(data: BusinessData): void {
        const requiredFields = [
            "businessName",
            "bankName",
            "accountNumber",
            "walletAddress",
        ];

        for (const field of requiredFields) {
            if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
                throw new Error(`Missing or invalid required field: ${field}`);
            }
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(data.walletAddress)) {
            throw new Error("Invalid ethereum wallet address");
        }

        if (data.businessName.trim().length < 2) {
            throw new Error("Business name too short");
        }

        if (data.accountNumber.trim().length < 10) {
            throw new Error("Invalid account number");
        }
    }
}