'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Badge,
  Modal,
  ModalFooter,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  EmptyState,
} from '@/components/ui'

export function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  return (
    <div className="min-h-screen bg-brand-navy p-8 md:p-12">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Cabeçalho */}
        <header className="border-b border-brand-cream/10 pb-8">
          <span className="label-caps text-brand-gold">Sistema de design</span>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-wide text-brand-cream">
            Tôrres Imobiliária
          </h1>
          <p className="mt-2 font-sans text-sm font-light text-brand-cream/50">
            Componentes base — Fase 3
          </p>
        </header>

        {/* ── Tipografia ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="label-caps text-brand-gold">Tipografia</h2>
          <div className="space-y-4">
            <p className="font-serif text-6xl font-bold uppercase tracking-widest text-brand-cream">
              Tôrres
            </p>
            <p className="label-caps tracking-widest text-brand-cream/60">
              Imobiliária — rótulo em Jost
            </p>
            <p className="font-serif text-3xl font-semibold text-brand-cream">
              Confiança que constrói futuros.
            </p>
            <p className="max-w-prose font-sans text-base font-light leading-relaxed text-brand-cream/70">
              Excelência em cada detalhe, segurança em cada negócio. Patrimônio para a vida toda —
              essa é a nossa entrega em cada transação imobiliária realizada na Tôrres.
            </p>
            <p className="text-gold-gradient font-serif text-2xl font-bold">
              Gradiente metálico dourado
            </p>
          </div>
        </section>

        {/* ── Cores ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="label-caps text-brand-gold">Paleta de cores</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { bg: 'bg-brand-navy', label: 'Navy', hex: '#0A1626' },
              { bg: 'bg-brand-navy-deep', label: 'Navy Deep', hex: '#060E16' },
              { bg: 'bg-brand-gold', label: 'Gold', hex: '#BD8338' },
              { bg: 'bg-brand-gold-light', label: 'Gold Light', hex: '#E2AC56' },
              { bg: 'bg-brand-cream', label: 'Cream', hex: '#E8E0D6' },
            ].map((c) => (
              <div key={c.hex} className="flex flex-col gap-2">
                <div className={`h-14 w-full rounded border border-brand-cream/10 ${c.bg}`} />
                <div>
                  <p className="font-sans text-xs font-medium text-brand-cream">{c.label}</p>
                  <p className="font-sans text-2xs text-brand-cream/40">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Botões ─────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="label-caps text-brand-gold">Botões</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Ver imóveis</Button>
            <Button variant="secondary">Saiba mais</Button>
            <Button variant="ghost">Cancelar</Button>
            <Button variant="primary" loading>
              Carregando
            </Button>
            <Button variant="primary" disabled>
              Desabilitado
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">
              Pequeno
            </Button>
            <Button variant="primary" size="md">
              Médio
            </Button>
            <Button variant="primary" size="lg">
              Grande
            </Button>
          </div>
        </section>

        {/* ── Badges ─────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="label-caps text-brand-gold">Badges de status</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="disponivel" dot />
            <Badge variant="reservado" dot />
            <Badge variant="vendido" dot />
            <Badge variant="lancamento" dot />
            <Badge variant="construcao" dot />
            <Badge variant="pronto" dot />
            <Badge variant="gold">Alto padrão</Badge>
            <Badge variant="neutral">Neutro</Badge>
          </div>
        </section>

        {/* ── Formulários ────────────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="label-caps text-brand-gold">Formulários</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome completo" placeholder="Ricardo Tôrres" />
            <Input label="E-mail" type="email" placeholder="contato@exemplo.com.br" />
            <Input label="Com erro" error="Campo obrigatório" placeholder="…" />
            <Input label="Desabilitado" disabled placeholder="Não editável" />
            <Select
              label="Tipo de imóvel"
              placeholder="Selecione"
              options={[
                { value: 'apartamento', label: 'Apartamento' },
                { value: 'casa', label: 'Casa' },
                { value: 'terreno', label: 'Terreno' },
                { value: 'comercial', label: 'Comercial' },
              ]}
            />
            <Select
              label="Select com erro"
              error="Selecione uma opção"
              placeholder="Selecione"
              options={[{ value: 'a', label: 'Opção A' }]}
            />
          </div>
          <Textarea
            label="Mensagem"
            placeholder="Tenho interesse neste imóvel e gostaria de agendar uma visita…"
          />
          <Checkbox
            label="Concordo em receber comunicações da Tôrres Imobiliária"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <Checkbox label="Checkbox com erro" error="Você precisa aceitar os termos" />
        </section>

        {/* ── Cards ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="label-caps text-brand-gold">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card hover>
              <CardHeader>
                <CardTitle>Apartamento na Savassi</CardTitle>
                <Badge variant="disponivel" dot />
              </CardHeader>
              <CardBody>Apartamento de alto padrão, 142m², 4 quartos, 2 suítes, 3 vagas.</CardBody>
              <CardFooter>
                <span className="font-serif text-xl font-bold text-brand-gold">R$ 1.850.000</span>
                <Button variant="ghost" size="sm">
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>

            <Card hover>
              <CardHeader>
                <CardTitle>Cobertura no Belvedere</CardTitle>
                <Badge variant="reservado" dot />
              </CardHeader>
              <CardBody>
                Cobertura duplex exclusiva, 320m², piscina privativa e vista panorâmica.
              </CardBody>
              <CardFooter>
                <span className="font-serif text-xl font-bold text-brand-gold">R$ 4.200.000</span>
                <Button variant="ghost" size="sm">
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* ── Skeleton ───────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="label-caps text-brand-gold">Estados de carregamento</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <SkeletonCard />
            <div className="space-y-4 rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6">
              <Skeleton height="24px" className="w-1/2" />
              <SkeletonText lines={4} />
              <div className="flex gap-3">
                <Skeleton height="40px" className="w-28" />
                <Skeleton height="40px" className="w-28" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Empty State ────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="label-caps text-brand-gold">Estado vazio</h2>
          <EmptyState
            title="Nenhum imóvel encontrado"
            description="Tente ampliar os filtros de busca ou explore outras regiões — temos opções em toda a Grande BH."
            action={{ label: 'Limpar filtros', onClick: () => {} }}
          />
        </section>

        {/* ── Modal ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="label-caps text-brand-gold">Modal</h2>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Abrir modal
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Interesse no imóvel"
            description="Preencha os dados abaixo e um de nossos corretores entrará em contato em breve."
          >
            <div className="space-y-4">
              <Input label="Nome" placeholder="Seu nome completo" />
              <Input label="Telefone" type="tel" placeholder="(31) 9 9999-9999" />
              <Textarea label="Mensagem" placeholder="Gostaria de agendar uma visita…" />
            </div>
            <ModalFooter>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm">
                Enviar mensagem
              </Button>
            </ModalFooter>
          </Modal>
        </section>
      </div>
    </div>
  )
}
