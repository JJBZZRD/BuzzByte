import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Middleware to check if user is authenticated admin could be added here

export async function GET() {
  try {
    // Fetch all messages, order by newest first
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
} 