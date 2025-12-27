/*
  Warnings:

  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "appointments";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "selectedDate" TEXT NOT NULL,
    "timeRange" TEXT NOT NULL,
    "durationHours" TEXT,
    "durationMinutes" TEXT,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
