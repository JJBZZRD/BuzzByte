import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateDailySummary } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageViewId, duration } = body;

    // Validate required fields
    if (!pageViewId) {
      return NextResponse.json(
        { error: "Missing required field: pageViewId" },
        { status: 400 }
      );
    }

    // Validate duration is a number
    if (isNaN(duration) || duration < 0) {
      return NextResponse.json(
        { error: "Duration must be a positive number" },
        { status: 400 }
      );
    }

    // Check if pageView exists
    const pageView = await prisma.pageView.findUnique({
      where: { id: pageViewId }
    });

    if (!pageView) {
      return NextResponse.json(
        { error: "Page view not found" },
        { status: 404 }
      );
    }

    // Update the page view with duration
    await prisma.pageView.update({
      where: { id: pageViewId },
      data: { duration }
    });

    // Update daily summary with new duration data
    await updateDailySummary();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating page view duration:", error);
    return NextResponse.json(
      { 
        error: "Failed to update page view duration",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 