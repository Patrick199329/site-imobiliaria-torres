import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PostForm from '@/components/admin/PostForm'

export default async function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <PostForm
      id={id}
      inicial={Object.fromEntries(
        Object.entries(post).map(([k, v]) => [k, v === null ? '' : String(v)])
      )}
    />
  )
}
