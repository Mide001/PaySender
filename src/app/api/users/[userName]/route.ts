import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
    const { params } = context;

    const name = params.userName;

    return NextResponse.json({
        message: `Hello ${name}!`
    })
}