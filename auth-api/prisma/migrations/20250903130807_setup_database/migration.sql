-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'USER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(32),
    "email" VARCHAR(254) NOT NULL,
    "password_hash" VARCHAR(100) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "last_login_ip" TEXT,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "blocked_until" TIMESTAMP(3),
    "password_reset_token" TEXT,
    "password_reset_expires" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL DEFAULT '',
    "surname" VARCHAR(64) NOT NULL DEFAULT '',
    "birthday" DATE,
    "location" VARCHAR(128) NOT NULL DEFAULT '',
    "bio" VARCHAR(256) NOT NULL DEFAULT '',
    "avatar_url" VARCHAR(512) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ip" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_failed_login_attempts_blocked_until_last_login_ip_idx" ON "public"."users"("failed_login_attempts", "blocked_until", "last_login_ip");

-- CreateIndex
CREATE INDEX "users_password_reset_token_password_reset_expires_idx" ON "public"."users"("password_reset_token", "password_reset_expires");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_email_deleted_at_idx" ON "public"."users"("email", "deleted_at");

-- CreateIndex
CREATE INDEX "users_username_deleted_at_idx" ON "public"."users"("username", "deleted_at");

-- CreateIndex
CREATE INDEX "users_id_deleted_at_idx" ON "public"."users"("id", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "public"."user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_user_id_idx" ON "public"."user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "public"."sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_ip_idx" ON "public"."sessions"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "public"."refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "public"."refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_idx" ON "public"."refresh_tokens"("session_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "public"."refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
