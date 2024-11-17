import type { NextApiRequest, NextApiResponse } from "next";
import { BusinessData, QRGenerationResult, ApiError } from "@/types/business";
import { BusinessQRGenerator } from "@/utils/BusinessQRGenerator";
import { NextResponse } from "next/server";


const generator = new BusinessQRGenerator(
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
);


export async function POST(
  req: Request,
) {
  try {
    const businessData = await req.json();
    const result = await generator.generateBusinessQR(businessData as BusinessData);
    return NextResponse.json({
      ...result,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 500,
    });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello Localhost" }, { status: 200 });
}
