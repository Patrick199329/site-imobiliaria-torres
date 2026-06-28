-- CreateTable
CREATE TABLE "_LeadImoveisInteresse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LeadImoveisInteresse_AB_unique" ON "_LeadImoveisInteresse"("A", "B");

-- CreateIndex
CREATE INDEX "_LeadImoveisInteresse_B_index" ON "_LeadImoveisInteresse"("B");

-- AddForeignKey
ALTER TABLE "_LeadImoveisInteresse" ADD CONSTRAINT "_LeadImoveisInteresse_A_fkey" FOREIGN KEY ("A") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadImoveisInteresse" ADD CONSTRAINT "_LeadImoveisInteresse_B_fkey" FOREIGN KEY ("B") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
