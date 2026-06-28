-- CreateEnum
CREATE TYPE "TipoImovel" AS ENUM ('APARTAMENTO', 'CASA', 'TERRENO', 'COMERCIAL');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('VENDA');

-- CreateEnum
CREATE TYPE "StatusImovel" AS ENUM ('DISPONIVEL', 'RESERVADO', 'VENDIDO');

-- CreateEnum
CREATE TYPE "FaseObra" AS ENUM ('LANCAMENTO', 'EM_CONSTRUCAO', 'PRONTO');

-- CreateEnum
CREATE TYPE "StatusUnidade" AS ENUM ('DISPONIVEL', 'RESERVADA', 'VENDIDA');

-- CreateEnum
CREATE TYPE "TipoLead" AS ENUM ('INTERESSE_COMPRA', 'AVALIACAO_VENDA');

-- CreateEnum
CREATE TYPE "OrigemLead" AS ENUM ('SITE', 'WHATSAPP', 'PORTAL_ZAP', 'PORTAL_VIVAREAL', 'PORTAL_OLX');

-- CreateEnum
CREATE TYPE "StatusLead" AS ENUM ('NOVO', 'EM_ANDAMENTO', 'CONVERTIDO', 'PERDIDO');

-- CreateTable
CREATE TABLE "Corretor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "creci" TEXT NOT NULL,
    "foto" TEXT,
    "bio" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Corretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tipo" "TipoImovel" NOT NULL,
    "transacao" "TipoTransacao" NOT NULL DEFAULT 'VENDA',
    "status" "StatusImovel" NOT NULL DEFAULT 'DISPONIVEL',
    "preco" DECIMAL(12,2) NOT NULL,
    "areaUtil" DECIMAL(8,2),
    "areaTotal" DECIMAL(8,2),
    "quartos" INTEGER,
    "suites" INTEGER,
    "vagas" INTEGER,
    "valorCondominio" DECIMAL(10,2),
    "valorIptu" DECIMAL(10,2),
    "descricao" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "cep" CHAR(9) NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "corretorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImovelImagem" (
    "id" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "isCapa" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ImovelImagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caracteristica" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Caracteristica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "mensagem" TEXT,
    "imovelId" TEXT,
    "tipo" "TipoLead" NOT NULL,
    "origem" "OrigemLead" NOT NULL DEFAULT 'SITE',
    "status" "StatusLead" NOT NULL DEFAULT 'NOVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lancamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "construtora" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "faseObra" "FaseObra" NOT NULL,
    "dataPrevistaEntrega" TIMESTAMP(3),
    "endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lancamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LancamentoImagem" (
    "id" TEXT NOT NULL,
    "lancamentoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "isCapa" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LancamentoImagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LancamentoUnidade" (
    "id" TEXT NOT NULL,
    "lancamentoId" TEXT NOT NULL,
    "tipologia" TEXT NOT NULL,
    "areaPrivativa" DECIMAL(8,2) NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "status" "StatusUnidade" NOT NULL DEFAULT 'DISPONIVEL',
    "bloco" TEXT,
    "andar" INTEGER,

    CONSTRAINT "LancamentoUnidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "capa" TEXT,
    "autorId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publicadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaracteristicaToImovel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Corretor_email_key" ON "Corretor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_slug_key" ON "Imovel"("slug");

-- CreateIndex
CREATE INDEX "ImovelImagem_imovelId_ordem_idx" ON "ImovelImagem"("imovelId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "Caracteristica_nome_key" ON "Caracteristica"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Lancamento_slug_key" ON "Lancamento"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CaracteristicaToImovel_AB_unique" ON "_CaracteristicaToImovel"("A", "B");

-- CreateIndex
CREATE INDEX "_CaracteristicaToImovel_B_index" ON "_CaracteristicaToImovel"("B");

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImovelImagem" ADD CONSTRAINT "ImovelImagem_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LancamentoImagem" ADD CONSTRAINT "LancamentoImagem_lancamentoId_fkey" FOREIGN KEY ("lancamentoId") REFERENCES "Lancamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LancamentoUnidade" ADD CONSTRAINT "LancamentoUnidade_lancamentoId_fkey" FOREIGN KEY ("lancamentoId") REFERENCES "Lancamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaracteristicaToImovel" ADD CONSTRAINT "_CaracteristicaToImovel_A_fkey" FOREIGN KEY ("A") REFERENCES "Caracteristica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaracteristicaToImovel" ADD CONSTRAINT "_CaracteristicaToImovel_B_fkey" FOREIGN KEY ("B") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
