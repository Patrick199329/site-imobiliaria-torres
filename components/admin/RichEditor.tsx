'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
}

const btnClass =
  'rounded px-2 py-1 font-sans text-xs text-brand-cream/60 transition-colors hover:bg-brand-cream/10 hover:text-brand-cream data-[active=true]:bg-brand-gold/20 data-[active=true]:text-brand-gold'

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[240px] prose prose-invert prose-sm max-w-none px-4 py-3 focus:outline-none font-sans text-brand-cream/80',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!editor) return null

  return (
    <div className="overflow-hidden rounded border border-brand-cream/15 bg-brand-navy-deep focus-within:border-brand-gold">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-brand-cream/10 px-2 py-1.5">
        <button
          type="button"
          data-active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass}
        >
          <strong>N</strong>
        </button>
        <button
          type="button"
          data-active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass}
        >
          <em>I</em>
        </button>
        <span className="mx-1 border-l border-brand-cream/10" />
        {([1, 2, 3] as const).map((n) => (
          <button
            key={n}
            type="button"
            data-active={editor.isActive('heading', { level: n })}
            onClick={() => editor.chain().focus().toggleHeading({ level: n }).run()}
            className={btnClass}
          >
            H{n}
          </button>
        ))}
        <span className="mx-1 border-l border-brand-cream/10" />
        <button
          type="button"
          data-active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass}
        >
          • Lista
        </button>
        <button
          type="button"
          data-active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass}
        >
          1. Lista
        </button>
        <button
          type="button"
          data-active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass}
        >
          &ldquo;Quote
        </button>
        <span className="mx-1 border-l border-brand-cream/10" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${btnClass} disabled:opacity-30`}
        >
          ↩
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${btnClass} disabled:opacity-30`}
        >
          ↪
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
