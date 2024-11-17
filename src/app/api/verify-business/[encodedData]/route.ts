import { NextResponse } from "next/server";
import { BusinessData } from "@/types/business";

export async function GET(
  request: Request,
  { params }: { params: { encodedData: string } }
) {
  try {
    const encodedData = params.encodedData;

    if (!encodedData || typeof encodedData !== "string") {
      return NextResponse.json(
        { error: "Missing encoded data" },
        { status: 400 }
      );
    }

    try {
      const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
      const businessData: BusinessData = JSON.parse(decodedData);

      const requiredFields = [
        "businessName",
        "bankName",
        "accountNumber",
        "walletAddress",
      ];

      for (const field of requiredFields) {
        if (!businessData[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(businessData);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid business data format" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify business" },
      { status: 500 }
    );
  }
}