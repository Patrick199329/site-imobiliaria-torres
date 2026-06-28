import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ erro: 'Nenhum arquivo' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  const ext = path.extname(file.name)
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
