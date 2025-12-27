-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "selectedDate" TEXT NOT NULL,
    "timeRange" TEXT NOT NULL,
    "durationHours" TEXT,
    "durationMinutes" TEXT,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);
