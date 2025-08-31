/*
  Warnings:

  - Made the column `name` on table `user_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surname` on table `user_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `user_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `user_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar_url` on table `user_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."user_profiles" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "surname" SET NOT NULL,
ALTER COLUMN "surname" SET DEFAULT '',
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "location" SET DEFAULT '',
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "bio" SET DEFAULT '',
ALTER COLUMN "avatar_url" SET NOT NULL,
ALTER COLUMN "avatar_url" SET DEFAULT '';
