import { z } from 'zod'

// Converts '' / null / undefined to null, rejects zero/negative
const optPos = z.preprocess((v) => {
  if (v === '' || v == null) return null
  const n = Number(v)
  return n > 0 ? n : null
}, z.number().positive().nullable().optional())

// Converts '' / null / undefined to null, accepts 0+
const optInt = z.preprocess(
  (v) => (v === '' || v == null ? null : Math.trunc(Number(v))),
  z.number().int().min(0).nullable().optional()
)

// Converts '' / null / undefined to null, any number
const optNum = z.preprocess(
  (v) => (v === '' || v == null ? null : Number(v)),
  z.number().nullable().optional()
)

export const leadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  mensagem: z.string().optional(),
  imovelId: z.string().optional(),
  tipo: z.enum(['INTERESSE_COMPRA', 'AVALIACAO_VENDA']).default('INTERESSE_COMPRA'),
})

export const imovelSchema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  slug: z.string().min(3, 'Slug obrigatório'),
  tipo: z.enum(['APARTAMENTO', 'CASA', 'TERRENO', 'COMERCIAL']),
  status: z.enum(['DISPONIVEL', 'RESERVADO', 'VENDIDO']).default('DISPONIVEL'),
  preco: z.coerce.number().positive('Preço obrigatório'),
  areaUtil: optPos,
  areaTotal: optPos,
  quartos: optInt,
  suites: optInt,
  vagas: optInt,
  valorCondominio: optPos,
  valorIptu: optPos,
  descricao: z.string().min(10, 'Descrição obrigatória'),
  endereco: z.string().min(3, 'Endereço obrigatório'),
  bairro: z.string().min(2, 'Bairro obrigatório'),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  uf: z.string().length(2, 'UF deve ter 2 letras'),
  cep: z.string().min(8, 'CEP inválido'),
  latitude: optNum,
  longitude: optNum,
  destaque: z.coerce.boolean().default(false),
  corretorId: z.string().min(1, 'Selecione um corretor'),
  transacao: z.enum(['VENDA']).default('VENDA'),
})

export const corretorSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  creci: z.string().min(3, 'CRECI obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  whatsapp: z.string().min(8, 'WhatsApp inválido'),
  bio: z.string().optional(),
  foto: z.string().url('URL inválida').optional().or(z.literal('')),
})

export const postSchema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  slug: z.string().min(3, 'Slug obrigatório'),
  conteudo: z.string().min(10, 'Conteúdo obrigatório'),
  autorId: z.string().min(1, 'Selecione um autor'),
  capa: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

export const lancamentoSchema = z.object({
  codigo: z.preprocess(
    (v) => (v === '' || v == null ? null : v),
    z.string().min(1).optional().nullable()
  ),
  nome: z.string().min(3, 'Nome obrigatório'),
  slug: z.string().min(3, 'Slug obrigatório'),
  construtora: z.string().min(2, 'Construtora obrigatória'),
  descricao: z.string().min(10, 'Descrição obrigatória'),
  faseObra: z.enum(['LANCAMENTO', 'EM_CONSTRUCAO', 'PRONTO']).default('LANCAMENTO'),
  dataPrevistaEntrega: z.string().optional(),
  endereco: z.string().min(3, 'Endereço obrigatório'),
  bairro: z.string().min(2, 'Bairro obrigatório'),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  uf: z.string().length(2, 'UF deve ter 2 letras'),
  latitude: optNum,
  longitude: optNum,
})

export type LeadInput = z.infer<typeof leadSchema>
export type ImovelInput = z.infer<typeof imovelSchema>
