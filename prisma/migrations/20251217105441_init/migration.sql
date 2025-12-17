/*
  Warnings:

  - The values [UPCOMING] on the enum `TournamentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLAYER', 'ORGANIZER', 'ADMIN');

-- AlterEnum
ALTER TYPE "RegistrationStatus" ADD VALUE 'WITHDRAWN';

-- AlterEnum
BEGIN;
CREATE TYPE "TournamentStatus_new" AS ENUM ('DRAFT', 'OPEN', 'ONGOING', 'COMPLETED', 'CANCELED');
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "TournamentStatus_new" USING ("status"::text::"TournamentStatus_new");
ALTER TYPE "TournamentStatus" RENAME TO "TournamentStatus_old";
ALTER TYPE "TournamentStatus_new" RENAME TO "TournamentStatus";
DROP TYPE "public"."TournamentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "Role";
