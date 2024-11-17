// app/api/verify-account/route.ts
import { NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { account_number, bank_code } = body;

    if (!account_number || !bank_code) {
      return NextResponse.json(
        {
          status: false,
          message: "Account number and bank code are required",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // If response is not ok OR data status is false, return error
    if (!response.ok || !data.status) {
      return NextResponse.json({
        status: false,
        message: data.message || "Could not verify account",
      });
    }

    // Success case - always return a response
    return NextResponse.json({
      status: true,
      data: {
        account_name: data.data.account_name,
        account_number: data.data.account_number,
        bank_code: bank_code,
      },
    });

  } catch (error) {
    console.error("Error verifying bank account: ", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error verifying bank account. Please try again",
      },
      {
        status: 500,
      }
    );
  }
}