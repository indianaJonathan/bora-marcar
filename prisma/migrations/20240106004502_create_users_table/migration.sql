/*
  Warnings:

  - You are about to drop the column `ownerEmail` on the `calendars` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `calendars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calendars" DROP COLUMN "ownerEmail",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD CONSTRAINT "calendars_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enc_pass" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
