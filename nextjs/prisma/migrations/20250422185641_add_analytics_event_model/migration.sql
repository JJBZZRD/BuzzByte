-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'custom',
    "properties" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorId" TEXT NOT NULL,
    "pageViewId" TEXT,
    CONSTRAINT "AnalyticsEvent_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalyticsEvent_pageViewId_fkey" FOREIGN KEY ("pageViewId") REFERENCES "PageView" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
