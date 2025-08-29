-- AlterTable
ALTER TABLE "public"."VerificationTokenTable" ADD CONSTRAINT "VerificationTokenTable_pkey" PRIMARY KEY ("identifier", "token");

-- DropIndex
DROP INDEX "public"."VerificationTokenTable_identifier_token_key";

-- CreateIndex
CREATE INDEX "AccountTable_userId_idx" ON "public"."AccountTable"("userId");

-- CreateIndex
CREATE INDEX "SessionTable_userId_idx" ON "public"."SessionTable"("userId");
