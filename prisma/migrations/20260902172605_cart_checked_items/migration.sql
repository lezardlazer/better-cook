-- CreateTable
CREATE TABLE "CartCheckedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "CartCheckedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartCheckedItem_userId_text_key" ON "CartCheckedItem"("userId", "text");

-- AddForeignKey
ALTER TABLE "CartCheckedItem" ADD CONSTRAINT "CartCheckedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
