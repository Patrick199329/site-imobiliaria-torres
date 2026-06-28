import { PrismaClient, TipoImovel, StatusImovel, FaseObra, StatusUnidade } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ─── Corretores ───────────────────────────────────────────────────────────
  const corretores = await Promise.all([
    prisma.corretor.create({
      data: {
        nome: 'Ricardo Tôrres',
        creci: 'CRECI-MG 32.451',
        email: 'ricardo@torresimobiliaria.com.br',
        telefone: '(31) 3222-4500',
        whatsapp: '5531991234567',
        bio: 'Especialista em imóveis de alto padrão na região da Savassi e Belvedere. 15 anos de mercado imobiliário em Belo Horizonte.',
        foto: '/images/corretores/ricardo-torres.jpg',
      },
    }),
    prisma.corretor.create({
      data: {
        nome: 'Ana Luísa Drummond',
        creci: 'CRECI-MG 41.872',
        email: 'analuisa@torresimobiliaria.com.br',
        telefone: '(31) 3222-4501',
        whatsapp: '5531992345678',
        bio: 'Referência em apartamentos compactos e studios para investidores. Especialista nos bairros Funcionários e Lourdes.',
        foto: '/images/corretores/ana-luisa.jpg',
      },
    }),
    prisma.corretor.create({
      data: {
        nome: 'Marcelo Guimarães',
        creci: 'CRECI-MG 28.019',
        email: 'marcelo@torresimobiliaria.com.br',
        telefone: '(31) 3222-4502',
        whatsapp: '5531993456789',
        bio: 'Especialista em casas e terrenos em condomínios fechados de Nova Lima e Brumadinho. 20 anos de experiência.',
        foto: '/images/corretores/marcelo-guimaraes.jpg',
      },
    }),
  ])

  const [ricardo, anaLuisa, marcelo] = corretores
  console.log('✓ Corretores criados')

  // ─── Características ──────────────────────────────────────────────────────
  const caracteristicasData = [
    'Piscina',
    'Academia',
    'Churrasqueira',
    'Portaria 24h',
    'Salão de festas',
    'Espaço gourmet',
    'Playground',
    'Quadra poliesportiva',
    'Jardim',
    'Área de serviço',
    'Varanda gourmet',
    'Home office',
    'Vista panorâmica',
    'Elevador',
    'Gerador',
    'Spa',
    'Coworking',
    'Pet place',
  ]

  const caracteristicas = await Promise.all(
    caracteristicasData.map((nome) => prisma.caracteristica.create({ data: { nome } }))
  )

  const findCaract = (...nomes: string[]) =>
    caracteristicas.filter((c) => nomes.includes(c.nome)).map((c) => ({ id: c.id }))

  console.log('✓ Características criadas')

  // ─── Imóveis ──────────────────────────────────────────────────────────────
  const imoveisData = [
    {
      titulo: 'Apartamento Alto Padrão na Savassi',
      slug: 'apartamento-alto-padrao-savassi-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.DISPONIVEL,
      preco: 1_850_000,
      areaUtil: 142,
      areaTotal: 165,
      quartos: 4,
      suites: 2,
      vagas: 3,
      valorCondominio: 1_200,
      valorIptu: 480,
      descricao:
        'Apartamento de alto padrão em andar elevado na Savassi, com vista privilegiada para a cidade. Acabamento em porcelanato italiano, cozinha planejada com ilha central, varanda gourmet de 23m² com churrasqueira a gás. Lazer completo no rooftop com piscina e spa.',
      endereco: 'Rua Alagoas, 1.421, 14º andar',
      bairro: 'Savassi',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30130-160',
      latitude: -19.9391,
      longitude: -43.9378,
      destaque: true,
      corretorId: ricardo.id,
      caracteristicas: findCaract('Piscina', 'Portaria 24h', 'Varanda gourmet', 'Elevador', 'Gerador', 'Spa'),
    },
    {
      titulo: 'Cobertura Duplex no Belvedere',
      slug: 'cobertura-duplex-belvedere-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.DISPONIVEL,
      preco: 4_200_000,
      areaUtil: 320,
      areaTotal: 380,
      quartos: 4,
      suites: 4,
      vagas: 4,
      valorCondominio: 3_800,
      valorIptu: 1_200,
      descricao:
        'Cobertura duplex exclusiva no Belvedere com piscina privativa e vista de 360° para Belo Horizonte. Projeto assinado por arquiteto renomado, com materiais importados, adega climatizada, home theater e automação residencial completa. Uma das coberturas mais exclusivas da cidade.',
      endereco: 'Av. Raja Gabaglia, 3.940, Cobertura',
      bairro: 'Belvedere',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30494-150',
      latitude: -19.9632,
      longitude: -43.9567,
      destaque: true,
      corretorId: ricardo.id,
      caracteristicas: findCaract('Piscina', 'Portaria 24h', 'Varanda gourmet', 'Home office', 'Vista panorâmica', 'Elevador', 'Gerador', 'Spa'),
    },
    {
      titulo: 'Apartamento 3 Quartos no Lourdes',
      slug: 'apartamento-3-quartos-lourdes-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.DISPONIVEL,
      preco: 980_000,
      areaUtil: 98,
      areaTotal: 112,
      quartos: 3,
      suites: 1,
      vagas: 2,
      valorCondominio: 820,
      valorIptu: 310,
      descricao:
        'Apartamento em edifício boutique no Lourdes, bairro nobre de Belo Horizonte. Planta funcional com sala ampla, cozinha americana e varanda. Dois andares de lazer com piscina, academia e salão de festas. Apenas 12 apartamentos por andar, garantindo privacidade e tranquilidade.',
      endereco: 'Rua Maranhão, 743, 8º andar',
      bairro: 'Lourdes',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30150-330',
      latitude: -19.9348,
      longitude: -43.9394,
      destaque: true,
      corretorId: anaLuisa.id,
      caracteristicas: findCaract('Piscina', 'Academia', 'Portaria 24h', 'Salão de festas', 'Elevador'),
    },
    {
      titulo: 'Studio Inteligente nos Funcionários',
      slug: 'studio-inteligente-funcionarios-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.DISPONIVEL,
      preco: 420_000,
      areaUtil: 38,
      areaTotal: 42,
      quartos: 1,
      suites: 1,
      vagas: 1,
      valorCondominio: 480,
      valorIptu: 120,
      descricao:
        'Studio compacto com planta inteligente nos Funcionários, ideal para investimento ou moradia executiva. Móveis sob medida, varanda integrada e coworking no condomínio. Localização estratégica a 300m do metrô e a 5 minutos da Av. do Contorno.',
      endereco: 'Av. Afonso Pena, 2.020, 5º andar',
      bairro: 'Funcionários',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30130-009',
      latitude: -19.9295,
      longitude: -43.9344,
      destaque: false,
      corretorId: anaLuisa.id,
      caracteristicas: findCaract('Portaria 24h', 'Elevador', 'Coworking', 'Academia'),
    },
    {
      titulo: 'Casa em Condomínio no Alphaville',
      slug: 'casa-condominio-alphaville-nova-lima',
      tipo: TipoImovel.CASA,
      status: StatusImovel.DISPONIVEL,
      preco: 2_650_000,
      areaUtil: 380,
      areaTotal: 850,
      quartos: 5,
      suites: 5,
      vagas: 4,
      valorCondominio: 2_200,
      valorIptu: 780,
      descricao:
        'Casa térrea contemporânea em condomínio fechado de alto padrão em Nova Lima. Piscina privativa de borda infinita, área gourmet coberta, jardim projetado e espaço kids. Acabamento premium com porcelanato 120x120, esquadrias em alumínio importado e automação residencial.',
      endereco: 'Rua das Mansões, 58 — Alphaville',
      bairro: 'Alphaville',
      cidade: 'Nova Lima',
      uf: 'MG',
      cep: '34000-000',
      latitude: -20.0167,
      longitude: -44.0000,
      destaque: true,
      corretorId: marcelo.id,
      caracteristicas: findCaract('Piscina', 'Churrasqueira', 'Portaria 24h', 'Jardim', 'Área de serviço', 'Espaço gourmet', 'Home office'),
    },
    {
      titulo: 'Casa Térrea no Vila da Serra',
      slug: 'casa-terrea-vila-da-serra-nova-lima',
      tipo: TipoImovel.CASA,
      status: StatusImovel.RESERVADO,
      preco: 1_480_000,
      areaUtil: 220,
      areaTotal: 420,
      quartos: 4,
      suites: 2,
      vagas: 3,
      valorCondominio: 1_650,
      valorIptu: 420,
      descricao:
        'Casa contemporânea em condomínio de casas no Vila da Serra. Espaço gourmet integrado à piscina, 4 quartos sendo 2 suítes, escritório e despensa. Acabamento de alto padrão com pisos em mármore travertino e cozinha planejada marca Kali. Condomínio com segurança 24h e área verde preservada.',
      endereco: 'Rua Serra do Curral, 112 — Vila da Serra',
      bairro: 'Vila da Serra',
      cidade: 'Nova Lima',
      uf: 'MG',
      cep: '34006-053',
      latitude: -19.9916,
      longitude: -43.9750,
      destaque: false,
      corretorId: marcelo.id,
      caracteristicas: findCaract('Piscina', 'Churrasqueira', 'Portaria 24h', 'Jardim', 'Área de serviço', 'Espaço gourmet'),
    },
    {
      titulo: 'Apartamento 2 Quartos no Buritis',
      slug: 'apartamento-2-quartos-buritis-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.DISPONIVEL,
      preco: 650_000,
      areaUtil: 72,
      areaTotal: 85,
      quartos: 2,
      suites: 1,
      vagas: 2,
      valorCondominio: 620,
      valorIptu: 195,
      descricao:
        'Apartamento com 2 quartos (sendo 1 suíte) no Buritis, um dos bairros mais valorizados do Oeste de BH. Planta bem distribuída, sala com varanda integrada, vaga dupla. Lazer completo: piscina, academia, playground e espaço pet.',
      endereco: 'Rua Desembargador Jorge Fontes, 540, 10º andar',
      bairro: 'Buritis',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30575-290',
      latitude: -19.9747,
      longitude: -43.9820,
      destaque: false,
      corretorId: anaLuisa.id,
      caracteristicas: findCaract('Piscina', 'Academia', 'Portaria 24h', 'Playground', 'Pet place', 'Elevador'),
    },
    {
      titulo: 'Sala Comercial no Centro Empresarial',
      slug: 'sala-comercial-centro-empresarial-bh',
      tipo: TipoImovel.COMERCIAL,
      status: StatusImovel.DISPONIVEL,
      preco: 580_000,
      areaUtil: 65,
      areaTotal: 72,
      quartos: 0,
      suites: 0,
      vagas: 2,
      valorCondominio: 950,
      valorIptu: 280,
      descricao:
        'Sala comercial em edifício triple A na Av. do Contorno. Piso elevado, forro de gesso com iluminação embutida, ar-condicionado central e recepção compartilhada no térreo. Ideal para escritórios, clínicas ou sedes corporativas. Vaga dupla coberta inclusa.',
      endereco: 'Av. do Contorno, 6.594, Conjunto 1102',
      bairro: 'Santo Agostinho',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30110-044',
      latitude: -19.9381,
      longitude: -43.9432,
      destaque: false,
      corretorId: ricardo.id,
      caracteristicas: findCaract('Portaria 24h', 'Elevador', 'Gerador'),
    },
    {
      titulo: 'Terreno em Condomínio em Brumadinho',
      slug: 'terreno-condominio-brumadinho-mg',
      tipo: TipoImovel.TERRENO,
      status: StatusImovel.DISPONIVEL,
      preco: 380_000,
      areaUtil: null,
      areaTotal: 1_200,
      quartos: null,
      suites: null,
      vagas: null,
      valorCondominio: 480,
      valorIptu: 95,
      descricao:
        'Terreno plano de 1.200m² em condomínio fechado de alto padrão em Brumadinho, a 35km de BH. Infraestrutura completa de água, luz, esgoto e pavimentação. Área verde nativa preservada, ideal para construção de casa com jardim amplo. Vistas para a Serra do Rola-Moça.',
      endereco: 'Lote 47 — Condomínio Reserva do Morro',
      bairro: 'Zona Rural',
      cidade: 'Brumadinho',
      uf: 'MG',
      cep: '35460-000',
      latitude: -20.1442,
      longitude: -44.2028,
      destaque: false,
      corretorId: marcelo.id,
      caracteristicas: findCaract('Portaria 24h', 'Jardim'),
    },
    {
      titulo: 'Apartamento 4 Quartos no Prado',
      slug: 'apartamento-4-quartos-prado-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.DISPONIVEL,
      preco: 1_150_000,
      areaUtil: 160,
      areaTotal: 185,
      quartos: 4,
      suites: 2,
      vagas: 3,
      valorCondominio: 1_050,
      valorIptu: 360,
      descricao:
        'Apartamento espaçoso e bem distribuído no Prado, com 4 quartos e sala com dois ambientes. Dois andares de lazer com piscina adulto e infantil, quadra poliesportiva, salão de festas e espaço gourmet. Excelente custo-benefício para famílias que buscam conforto e localização privilegiada.',
      endereco: 'Rua Padre Marinho, 880, 7º andar',
      bairro: 'Prado',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30411-050',
      latitude: -19.9512,
      longitude: -43.9632,
      destaque: false,
      corretorId: ricardo.id,
      caracteristicas: findCaract('Piscina', 'Academia', 'Churrasqueira', 'Portaria 24h', 'Salão de festas', 'Quadra poliesportiva', 'Playground', 'Elevador'),
    },
    {
      titulo: 'Casa Moderna no Condomínio Quintas do Sol',
      slug: 'casa-moderna-quintas-do-sol-nova-lima',
      tipo: TipoImovel.CASA,
      status: StatusImovel.DISPONIVEL,
      preco: 3_400_000,
      areaUtil: 480,
      areaTotal: 1_100,
      quartos: 5,
      suites: 5,
      vagas: 5,
      valorCondominio: 2_800,
      valorIptu: 950,
      descricao:
        'Casa de arquitetura contemporânea em um dos condomínios mais exclusivos de Nova Lima. Projeto premiado com janelas do piso ao teto, iluminação natural excepcional, piscina com raia de 15m, adega para 400 garrafas, cinema privativo e espaço zen. Acabamentos assinados e paisagismo de renome.',
      endereco: 'Alameda das Quaresmeiras, 22 — Quintas do Sol',
      bairro: 'Quintas do Sol',
      cidade: 'Nova Lima',
      uf: 'MG',
      cep: '34006-650',
      latitude: -20.0023,
      longitude: -43.9887,
      destaque: true,
      corretorId: marcelo.id,
      caracteristicas: findCaract('Piscina', 'Churrasqueira', 'Portaria 24h', 'Jardim', 'Área de serviço', 'Home office', 'Vista panorâmica', 'Spa'),
    },
    {
      titulo: 'Apartamento Garden no São Pedro',
      slug: 'apartamento-garden-sao-pedro-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.DISPONIVEL,
      preco: 890_000,
      areaUtil: 110,
      areaTotal: 180,
      quartos: 3,
      suites: 1,
      vagas: 2,
      valorCondominio: 780,
      valorIptu: 260,
      descricao:
        'Apartamento garden raro no São Pedro com jardim privativo de 70m². Planta com sala de jantar e living separados, suíte com closet e banheira, cozinha com ilha e área gourmet. Uma oportunidade única de ter quintal particular em um bairro nobre de BH.',
      endereco: 'Rua São Paulo, 314, Apto Garden',
      bairro: 'São Pedro',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30330-080',
      latitude: -19.9428,
      longitude: -43.9403,
      destaque: false,
      corretorId: anaLuisa.id,
      caracteristicas: findCaract('Jardim', 'Churrasqueira', 'Portaria 24h', 'Varanda gourmet', 'Elevador'),
    },
    {
      titulo: 'Apartamento Compacto no Centro',
      slug: 'apartamento-compacto-centro-bh',
      tipo: TipoImovel.APARTAMENTO,
      status: StatusImovel.VENDIDO,
      preco: 310_000,
      areaUtil: 45,
      areaTotal: 52,
      quartos: 2,
      suites: 0,
      vagas: 1,
      valorCondominio: 390,
      valorIptu: 95,
      descricao:
        'Apartamento compacto e bem localizado no Centro de BH, próximo ao metrô Lagoinha. Planta funcional com 2 quartos, sala e cozinha americana. Ótima opção para moradia ou investimento com renda de aluguel.',
      endereco: 'Rua dos Tupis, 512, 6º andar',
      bairro: 'Centro',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30190-060',
      latitude: -19.9193,
      longitude: -43.9386,
      destaque: false,
      corretorId: anaLuisa.id,
      caracteristicas: findCaract('Portaria 24h', 'Elevador'),
    },
    {
      titulo: 'Galpão Comercial no Barreiro',
      slug: 'galpao-comercial-barreiro-bh',
      tipo: TipoImovel.COMERCIAL,
      status: StatusImovel.DISPONIVEL,
      preco: 2_100_000,
      areaUtil: 1_800,
      areaTotal: 2_400,
      quartos: 0,
      suites: 0,
      vagas: 20,
      valorCondominio: null,
      valorIptu: 1_100,
      descricao:
        'Galpão logístico com 1.800m² de área útil no Barreiro, com pé-direito de 8m, dois portões de acesso para caminhões e escritório de 120m² no mezanino. Próximo à BR-040 e com excelente acesso para distribuição na Região Metropolitana de BH.',
      endereco: 'Av. Afonso Vaz de Melo, 1.200',
      bairro: 'Barreiro de Cima',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30640-170',
      latitude: -20.0012,
      longitude: -44.0321,
      destaque: false,
      corretorId: ricardo.id,
      caracteristicas: findCaract('Portaria 24h', 'Gerador'),
    },
    {
      titulo: 'Casa em Condomínio no Retiro das Pedras',
      slug: 'casa-retiro-das-pedras-brumadinho',
      tipo: TipoImovel.CASA,
      status: StatusImovel.DISPONIVEL,
      preco: 1_900_000,
      areaUtil: 280,
      areaTotal: 600,
      quartos: 4,
      suites: 3,
      vagas: 3,
      valorCondominio: 1_800,
      valorIptu: 520,
      descricao:
        'Casa em condomínio de luxo no Retiro das Pedras, em Brumadinho. Rodeada por mata preservada, com deck sobre espelho d\'água, pérgola com churrasqueira integrada e jardim com iluminação cênica. A 40km de BH, com acesso pavimentado e segurança 24 horas.',
      endereco: 'Rua das Bromélias, 89 — Retiro das Pedras',
      bairro: 'Retiro das Pedras',
      cidade: 'Brumadinho',
      uf: 'MG',
      cep: '35460-000',
      latitude: -20.1615,
      longitude: -44.1978,
      destaque: true,
      corretorId: marcelo.id,
      caracteristicas: findCaract('Piscina', 'Churrasqueira', 'Portaria 24h', 'Jardim', 'Área de serviço', 'Varanda gourmet'),
    },
  ]

  for (const imovel of imoveisData) {
    const { caracteristicas: caracts, ...imovelData } = imovel
    await prisma.imovel.create({
      data: {
        ...imovelData,
        caracteristicas: { connect: caracts },
        imagens: {
          create: [
            { url: `/images/imoveis/${imovelData.slug}-1.jpg`, ordem: 0, isCapa: true },
            { url: `/images/imoveis/${imovelData.slug}-2.jpg`, ordem: 1, isCapa: false },
            { url: `/images/imoveis/${imovelData.slug}-3.jpg`, ordem: 2, isCapa: false },
          ],
        },
      },
    })
  }
  console.log('✓ Imóveis criados')

  // ─── Lançamentos ─────────────────────────────────────────────────────────
  await prisma.lancamento.create({
    data: {
      nome: 'Residencial Pedra da Serra',
      slug: 'residencial-pedra-da-serra',
      construtora: 'MRV Engenharia',
      descricao:
        'O Pedra da Serra é um empreendimento exclusivo no coração de Nova Lima, projetado para quem busca o equilíbrio entre natureza e sofisticação urbana. Com arquitetura contemporânea assinada, o condomínio oferece lazer completo em cinco andares, incluindo rooftop infinity pool com vista para a Serra do Rola-Moça.',
      faseObra: FaseObra.EM_CONSTRUCAO,
      dataPrevistaEntrega: new Date('2026-12-01'),
      endereco: 'Av. Central, 1.500 — Nova Lima',
      bairro: 'Centro',
      cidade: 'Nova Lima',
      uf: 'MG',
      latitude: -20.0213,
      longitude: -44.0134,
      imagens: {
        create: [
          { url: '/images/lancamentos/pedra-da-serra-1.jpg', ordem: 0, isCapa: true },
          { url: '/images/lancamentos/pedra-da-serra-2.jpg', ordem: 1, isCapa: false },
          { url: '/images/lancamentos/pedra-da-serra-3.jpg', ordem: 2, isCapa: false },
        ],
      },
      unidades: {
        create: [
          {
            tipologia: '2 quartos — 68m²',
            areaPrivativa: 68,
            valor: 520_000,
            status: StatusUnidade.DISPONIVEL,
            bloco: 'A',
            andar: 3,
          },
          {
            tipologia: '3 quartos — 92m²',
            areaPrivativa: 92,
            valor: 720_000,
            status: StatusUnidade.RESERVADA,
            bloco: 'A',
            andar: 5,
          },
          {
            tipologia: '3 quartos com suíte — 105m²',
            areaPrivativa: 105,
            valor: 840_000,
            status: StatusUnidade.DISPONIVEL,
            bloco: 'B',
            andar: 8,
          },
          {
            tipologia: 'Cobertura — 180m²',
            areaPrivativa: 180,
            valor: 1_450_000,
            status: StatusUnidade.DISPONIVEL,
            bloco: 'B',
            andar: 12,
          },
        ],
      },
    },
  })

  await prisma.lancamento.create({
    data: {
      nome: 'Lumière Savassi',
      slug: 'lumiere-savassi',
      construtora: 'Direcional Engenharia',
      descricao:
        'O Lumière Savassi redefine o conceito de morar bem no bairro mais desejado de Belo Horizonte. Boutique building com apenas 32 unidades por torre, cada uma entregue com acabamento de alto padrão e varanda gourmet. Localizado a 200m do Parque Municipal Américo Renné Giannetti.',
      faseObra: FaseObra.LANCAMENTO,
      dataPrevistaEntrega: new Date('2028-06-01'),
      endereco: 'Rua Pernambuco, 780 — Savassi',
      bairro: 'Savassi',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      latitude: -19.9378,
      longitude: -43.9345,
      imagens: {
        create: [
          { url: '/images/lancamentos/lumiere-savassi-1.jpg', ordem: 0, isCapa: true },
          { url: '/images/lancamentos/lumiere-savassi-2.jpg', ordem: 1, isCapa: false },
          { url: '/images/lancamentos/lumiere-savassi-3.jpg', ordem: 2, isCapa: false },
        ],
      },
      unidades: {
        create: [
          {
            tipologia: 'Studio — 42m²',
            areaPrivativa: 42,
            valor: 480_000,
            status: StatusUnidade.DISPONIVEL,
            bloco: 'Único',
            andar: 2,
          },
          {
            tipologia: '2 quartos — 78m²',
            areaPrivativa: 78,
            valor: 890_000,
            status: StatusUnidade.DISPONIVEL,
            bloco: 'Único',
            andar: 6,
          },
          {
            tipologia: '3 quartos com 2 suítes — 118m²',
            areaPrivativa: 118,
            valor: 1_250_000,
            status: StatusUnidade.RESERVADA,
            bloco: 'Único',
            andar: 10,
          },
          {
            tipologia: 'Penthouse — 210m²',
            areaPrivativa: 210,
            valor: 2_800_000,
            status: StatusUnidade.DISPONIVEL,
            bloco: 'Único',
            andar: 14,
          },
        ],
      },
    },
  })
  console.log('✓ Lançamentos criados')

  // ─── Posts de blog ────────────────────────────────────────────────────────
  await prisma.post.create({
    data: {
      titulo: 'Como avaliar o preço justo de um imóvel em Belo Horizonte',
      slug: 'como-avaliar-preco-justo-imovel-belo-horizonte',
      conteudo: `Comprar ou vender um imóvel é uma das decisões financeiras mais relevantes da vida. Entender como o mercado precifica propriedades em Belo Horizonte é o primeiro passo para fazer um negócio seguro.

## Os fatores que definem o valor

O preço de um imóvel nunca é arbitrário. Ele resulta da combinação de localização, infraestrutura do entorno, estado de conservação, metragem e demanda do mercado naquele momento. No contexto de BH, bairros como Savassi, Belvedere e Lourdes historicamente apresentam valorização acima da média da cidade.

## Como pesquisar com precisão

Não confie apenas em portais de anúncios. O preço anunciado e o preço efetivo de venda costumam ter uma diferença de 5% a 15%. Para ter uma referência real, consulte cartórios de registro de imóveis ou peça a um corretor credenciado uma avaliação fundamentada em transações recentes na mesma região.

## O papel do CRECI

Sempre exija que o corretor responsável pela negociação apresente seu número de CRECI ativo. Isso garante que você está sendo assessorado por um profissional habilitado e sujeito ao Código de Ética da classe.`,
      capa: '/images/blog/avaliacao-imovel-bh.jpg',
      autorId: ricardo.id,
      metaTitle: 'Como avaliar o preço justo de um imóvel em BH | Tôrres Imobiliária',
      metaDescription:
        'Entenda os fatores que determinam o valor de mercado de imóveis em Belo Horizonte e saiba como pesquisar com precisão antes de comprar ou vender.',
      publicadoEm: new Date('2025-10-15'),
    },
  })

  await prisma.post.create({
    data: {
      titulo: 'Financiamento imobiliário em 2025: o que mudou e como se preparar',
      slug: 'financiamento-imobiliario-2025-mudancas',
      conteudo: `O mercado de crédito imobiliário passou por mudanças significativas nos últimos meses. Taxas, regras de entrada e prazos máximos foram revisados pelos principais bancos. Quem está planejando comprar um imóvel em 2025 precisa entender essas alterações antes de assinar qualquer proposta.

## Taxa Selic e o impacto no crédito

A taxa básica de juros afeta diretamente o custo do financiamento imobiliário. Quando a Selic sobe, os bancos tendem a ajustar para cima suas taxas de empréstimo. Por isso, acompanhar o calendário do Copom e as projeções de mercado é parte estratégica do planejamento de compra.

## FGTS: como usar na aquisição

O Fundo de Garantia pode ser utilizado para amortizar o saldo devedor ou como parte da entrada, desde que o comprador atenda aos critérios da Caixa Econômica Federal. Em imóveis enquadrados no teto do programa habitacional vigente, o FGTS pode representar uma economia significativa no custo total da operação.

## Dica prática

Antes de escolher o imóvel, faça uma simulação de crédito em pelo menos três bancos diferentes. As condições variam e uma diferença de 0,3% na taxa de juros pode representar dezenas de milhares de reais ao longo de um financiamento de 30 anos.`,
      capa: '/images/blog/financiamento-2025.jpg',
      autorId: anaLuisa.id,
      metaTitle: 'Financiamento imobiliário em 2025: o que mudou | Tôrres Imobiliária',
      metaDescription:
        'Confira as principais mudanças no crédito imobiliário em 2025 e saiba como se preparar para financiar um imóvel com as melhores condições disponíveis.',
      publicadoEm: new Date('2025-11-03'),
    },
  })

  await prisma.post.create({
    data: {
      titulo: 'Nova Lima: por que o município virou o destino preferido de quem sai de BH',
      slug: 'nova-lima-destino-preferido-moradores-belo-horizonte',
      conteudo: `Nova Lima passou de cidade-dormitório a destino de escolha para famílias que buscam qualidade de vida sem abrir mão da proximidade com Belo Horizonte. O fenômeno é visível nos números: nos últimos cinco anos, o município registrou um dos maiores crescimentos de oferta de imóveis de alto padrão em Minas Gerais.

## O que explica a migração

Condomínios fechados com ampla área verde, menor densidade urbana, ar mais limpo e distância razoável do centro de BH (entre 20 e 40 minutos pela BR-040 ou pela Linha Verde) fazem de Nova Lima uma alternativa atraente. A presença de escolas internacionais e de uma infraestrutura de saúde de qualidade reforça o apelo para famílias com filhos.

## Regiões em destaque

Vila da Serra e Alphaville consolidaram-se como os endereços mais procurados. O Quintas do Sol, empreendimento de ultra-luxo, contribuiu para elevar o ticket médio da região. Já bairros como Morro do Pilar e Retiro das Pedras atraem quem busca uma proposta mais integrada à natureza.

## O que esperar do mercado

A tendência é de valorização sustentada, impulsionada pela escassez de terrenos em BH e pelo aumento da demanda por espaço pós-pandemia. Para investidores, Nova Lima representa uma combinação interessante de segurança patrimonial e potencial de ganho de capital.`,
      capa: '/images/blog/nova-lima-mercado-imobiliario.jpg',
      autorId: marcelo.id,
      metaTitle: 'Nova Lima: por que virou o destino preferido de quem sai de BH | Tôrres',
      metaDescription:
        'Entenda por que Nova Lima se tornou o principal destino de famílias que buscam qualidade de vida com acesso rápido a Belo Horizonte.',
      publicadoEm: new Date('2025-12-10'),
    },
  })
  console.log('✓ Posts criados')

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
