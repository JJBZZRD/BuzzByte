import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, eventName, eventType, properties, pageViewId } = body;

    // Validate required fields
    if (!visitorId || !eventName) {
      return NextResponse.json(
        { error: "Missing required fields: visitorId and eventName are required" },
        { status: 400 }
      );
    }

    // Check if visitor exists, create if not
    let visitor = await prisma.visitor.findUnique({
      where: { id: visitorId }
    });

    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          id: visitorId,
          firstSeen: new Date(),
          lastSeen: new Date(),
        }
      });
    } else {
      // Update visitor's lastSeen timestamp
      await prisma.visitor.update({
        where: { id: visitorId },
        data: { lastSeen: new Date() }
      });
    }

    // Create event record
    const event = await prisma.analyticsEvent.create({
      data: {
        id: uuidv4(),
        eventName,
        eventType: eventType || "custom",
        properties: properties ? JSON.stringify(properties) : null,
        visitorId,
        pageViewId,
        timestamp: new Date(),
      }
    });

    return NextResponse.json({ 
      success: true, 
      eventId: event.id 
    });
  } catch (error) {
    console.error("Error tracking event:", error);
    return NextResponse.json(
      { 
        error: "Failed to track event",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 