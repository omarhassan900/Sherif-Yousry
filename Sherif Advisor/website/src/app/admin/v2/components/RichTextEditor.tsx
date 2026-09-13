'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Heading4,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export interface RichTextEditorProps {
  /** Current HTML content */
  content: string;
  /** Called when editor content changes */
  onChange: (html: string) => void;
  /** Text direction: 'ltr' for English, 'rtl' for Arabic */
  direction?: 'ltr' | 'rtl';
  /** Placeholder text shown when editor is empty */
  placeholder?: string;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Additional CSS class names for the wrapper */
  className?: string;
}

/**
 * RichTextEditor — Tiptap-based rich text editor wrapper for the admin portal.
 *
 * Supports headings (h2-h4), bold, italic, bullet/numbered lists, links,
 * and embedded images. Configurable text direction (RTL/LTR) for bilingual editing.
 */
export default function RichTextEditor({
  content,
  onChange,
  direction = 'ltr',
  placeholder,
  disabled = false,
  className = '',
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-gold underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor: editorInstance }) => {
      onChange(editorInstance.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none ${
          direction === 'rtl' ? 'text-right' : 'text-left'
        }`,
        dir: direction,
      },
    },
    immediatelyRender: false,
  });

  // Sync external content changes (e.g. when restoring a revision)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Sync editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }

    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setShowImageInput(false);
  }, [editor, imageUrl]);

  const openLinkInput = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setShowLinkInput(true);
    setShowImageInput(false);
  }, [editor]);

  const openImageInput = useCallback(() => {
    setImageUrl('');
    setShowImageInput(true);
    setShowLinkInput(false);
  }, []);

  if (!editor) {
    return (
      <div
        className={`border border-white/10 rounded bg-brand-navy-dark min-h-[280px] animate-pulse ${className}`}
      />
    );
  }

  return (
    <div
      className={`border border-white/10 rounded bg-brand-navy-dark overflow-hidden focus-within:border-brand-gold/40 transition-colors ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/10 bg-brand-navy/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          disabled={disabled}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          disabled={disabled}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive('heading', { level: 4 })}
          disabled={disabled}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={disabled}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={disabled}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          disabled={disabled}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          disabled={disabled}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={openLinkInput}
          active={editor.isActive('link')}
          disabled={disabled}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={openImageInput}
          active={false}
          disabled={disabled}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          disabled={disabled || !editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          disabled={disabled || !editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Link input popup */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-brand-navy/80">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-2 py-1 text-sm bg-brand-navy-dark border border-white/20 rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false);
              }
            }}
            autoFocus
          />
          <button
            onClick={setLink}
            className="px-3 py-1 text-xs font-medium bg-brand-gold text-brand-navy rounded hover:bg-brand-gold/90 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              }
              setShowLinkInput(false);
            }}
            className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            {editor.isActive('link') ? 'Remove' : 'Cancel'}
          </button>
        </div>
      )}

      {/* Image input popup */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-brand-navy/80">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (e.g. /uploads/image.jpg)"
            className="flex-1 px-2 py-1 text-sm bg-brand-navy-dark border border-white/20 rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImage();
              }
              if (e.key === 'Escape') {
                setShowImageInput(false);
              }
            }}
            autoFocus
          />
          <button
            onClick={addImage}
            disabled={!imageUrl}
            className="px-3 py-1 text-xs font-medium bg-brand-gold text-brand-navy rounded hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
          >
            Insert
          </button>
          <button
            onClick={() => setShowImageInput(false)}
            className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor content area */}
      <div className={placeholder && !content ? 'relative' : ''}>
        {placeholder && editor.isEmpty && (
          <div
            className={`absolute top-3 ${
              direction === 'rtl' ? 'right-4' : 'left-4'
            } text-text-muted pointer-events-none text-sm`}
          >
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/* ─────────── Toolbar Sub-components ─────────── */

interface ToolbarButtonProps {
  onClick: () => void;
  active: boolean;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`
        p-1.5 rounded transition-colors
        ${
          active
            ? 'bg-brand-gold/20 text-brand-gold'
            : 'text-text-muted hover:text-text-primary hover:bg-white/5'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-white/10 mx-1" />;
}
