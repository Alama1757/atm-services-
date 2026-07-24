-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "formateurApproved" BOOLEAN NOT NULL DEFAULT false;
