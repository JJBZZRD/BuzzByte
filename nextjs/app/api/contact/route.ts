import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new message in the database
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully",
      id: newMessage.id
    }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
} 