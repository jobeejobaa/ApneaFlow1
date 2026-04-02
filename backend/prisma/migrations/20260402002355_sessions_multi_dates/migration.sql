/*
  Warnings:

  - You are about to drop the column `date` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `courses` table. All the data in the column will be lost.
  - Added the required column `sessions` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "sessions" JSONB NOT NULL;
