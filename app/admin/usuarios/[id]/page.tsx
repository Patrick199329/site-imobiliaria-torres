import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UsuarioForm from '@/components/admin/UsuarioForm'

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: params.id },
    select: { id: true, nome: true, email: true, role: true, ativo: true },
  })

  if (!usuario) notFound()

  return (
    <UsuarioForm
      id={usuario.id}
      inicial={{
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        ativo: usuario.ativo,
      }}
    />
  )
}
