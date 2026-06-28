import { prisma } from './prisma'

export async function getConfig(chave: string): Promise<string | null> {
  const config = await prisma.configuracaoSistema.findUnique({ where: { chave } })
  return config?.valor ?? null
}
