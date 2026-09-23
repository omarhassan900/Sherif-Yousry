'use client';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3, Heading4,
  Link as LinkIcon, Image as ImageIcon, Undo, Redo, Quote,
  Code, Terminal, Minus, AlignLeft, AlignCenter, AlignRight,
  Highlighter, Eraser, Palette, Code2, X, Check
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// ==========================================
// 1. CUSTOM EXTENSIONS
// ==========================================

/** 
 * Extension to preserve inline CSS styles (colors, margins, line-heights, font-families) 
 * on Headings, Paragraphs, and Text.
 */
const PreserveStyles = Extension.create({
  name: 'preserveStyles',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph', 'textStyle', 'link'],
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute('style'),
            renderHTML: (attributes) => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            },
          },
        },
      },
    ];
  },
});

/** Extension to support Font Size */
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ''),
          renderHTML: (attributes) => {
            if (!attributes.fontSize) return {};
            return { style: `font-size: ${attributes.fontSize}` };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

/** Extension to preserve custom attributes like data-dc-tpl and id */
const CustomAttributes = Extension.create({
  name: 'customAttributes',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph', 'textStyle', 'link'],
        attributes: {
          id: { 
            default: null, 
            parseHTML: (element) => element.getAttribute('id'), 
            renderHTML: (attributes) => attributes.id ? { id: attributes.id } : {} 
          },
          'data-dc-tpl': { 
            default: null, 
            parseHTML: (element) => element.getAttribute('data-dc-tpl'), 
            renderHTML: (attributes) => attributes['data-dc-tpl'] ? { 'data-dc-tpl': attributes['data-dc-tpl'] } : {} 
          },
        },
      },
    ];
  },
});

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  direction?: 'ltr' | 'rtl';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px', '60px'];

export default function RichTextEditor({
  content, onChange, direction = 'ltr', placeholder, disabled = false, className = '',
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showHtmlImport, setShowHtmlImport] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-brand-gold pl-4 italic my-4 text-gray-300' } },
        code: { HTMLAttributes: { class: 'bg-brand-navy/50 text-brand-gold px-1.5 py-0.5 rounded text-sm font-mono' } },
        codeBlock: { HTMLAttributes: { class: 'bg-brand-navy/50 text-gray-300 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto' } },
        horizontalRule: { HTMLAttributes: { class: 'border-t border-white/10 my-6' } },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize,
      CustomAttributes, 
      PreserveStyles, // ✅ THIS IS THE MAGIC EXTENSION THAT KEEPS YOUR CSS
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-gold underline' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto rounded-lg my-4' } }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor: editorInstance }) => onChange(editorInstance.getHTML()),
    editorProps: {
      attributes: {
        // Note: We use a very basic class here so Tailwind's `prose` doesn't override your inline styles
        class: `max-w-none min-h-[200px] px-4 py-3 focus:outline-none ${direction === 'rtl' ? 'text-right' : 'text-left'}`,
        dir: direction,
      },
      transformPastedHTML(html: string) {
        // Only strip Word garbage, keep everything else
        return html
          .replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')
          .replace(/<span style="mso-[^"]+">/gi, '')
          .replace(/class="Mso[^"]*"/gi, '')
          .replace(/<meta[^>]*>/gi, '')
          .replace(/<!--[\s\S]*?-->/gi, '');
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [disabled, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setLinkUrl(''); setShowLinkInput(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl(''); setShowImageInput(false);
  }, [editor, imageUrl]);

  const openLinkInput = useCallback(() => {
    if (!editor) return;
    setLinkUrl(editor.getAttributes('link').href || '');
    setShowLinkInput(true); setShowImageInput(false);
  }, [editor]);

  const openImageInput = useCallback(() => {
    setImageUrl(''); setShowImageInput(true); setShowLinkInput(false);
  }, []);

  const handleImportHtml = () => {
    if (editor && htmlInput.trim()) {
      try {
        const cleanHtml = htmlInput
          .replace(/<article[^>]*>/gi, '<div>')
          .replace(/<\/article>/gi, '</div>');
        
        editor.chain().focus().setContent(cleanHtml).run();
        setHtmlInput('');
        setShowHtmlImport(false);
      } catch (error) {
        console.error('Failed to import HTML:', error);
      }
    }
  };

  if (!editor) return <div className={`border border-white/10 rounded-lg bg-brand-navy-dark min-h-[280px] animate-pulse ${className}`} />;

  const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';

  return (
    <div className={`border border-white/10 rounded-lg bg-brand-navy-dark overflow-hidden focus-within:border-brand-gold/40 transition-colors ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/10 bg-brand-navy/50">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={disabled || !editor.can().undo()} title="Undo"><Undo className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={disabled || !editor.can().redo()} title="Redo"><Redo className="w-4 h-4" /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} disabled={disabled} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} disabled={disabled} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} disabled={disabled} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive('heading', { level: 4 })} disabled={disabled} title="Heading 4"><Heading4 className="w-4 h-4" /></ToolbarButton>
        <ToolbarDivider />

        <select
          value={currentFontSize}
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          disabled={disabled}
          className="h-8 px-2 text-xs bg-brand-navy-dark border border-white/10 rounded text-text-primary focus:outline-none focus:border-brand-gold/40 cursor-pointer"
          title="Font Size"
        >
          {FONT_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} disabled={disabled} title="Bold"><Bold className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} disabled={disabled} title="Italic"><Italic className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} disabled={disabled} title="Underline"><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} disabled={disabled} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} disabled={disabled} title="Highlight"><Highlighter className="w-4 h-4" /></ToolbarButton>
        
        <div className="relative group">
          <ToolbarButton onClick={() => document.getElementById('rich-text-color-picker')?.click()} active={editor.isActive('textStyle')} disabled={disabled} title="Text Color"><Palette className="w-4 h-4" /></ToolbarButton>
          <input id="rich-text-color-picker" type="color" className="absolute opacity-0 w-0 h-0 pointer-events-none" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} disabled={disabled} />
        </div>
        <ToolbarButton onClick={() => editor.chain().focus().unsetColor().run()} disabled={disabled} title="Remove Color"><span className="text-xs font-bold px-1">A</span></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} disabled={disabled} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} disabled={disabled} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} disabled={disabled} title="Align Right"><AlignRight className="w-4 h-4" /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} disabled={disabled} title="Bullet List"><List className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} disabled={disabled} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} disabled={disabled} title="Blockquote"><Quote className="w-4 h-4" /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} disabled={disabled} title="Inline Code"><Code className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} disabled={disabled} title="Code Block"><Terminal className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={disabled} title="Horizontal Rule"><Minus className="w-4 h-4" /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={openLinkInput} active={editor.isActive('link')} disabled={disabled} title="Insert Link"><LinkIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={openImageInput} disabled={disabled} title="Insert Image"><ImageIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => setShowHtmlImport(true)} disabled={disabled} title="Import HTML"><Code2 className="w-4 h-4" /></ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} disabled={disabled} title="Clear Formatting"><Eraser className="w-4 h-4" /></ToolbarButton>
      </div>

      {/* HTML Import Modal */}
      {showHtmlImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-brand-navy-dark border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-text-primary">Import HTML Content</h3>
              <button onClick={() => setShowHtmlImport(false)} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
              <p className="text-xs text-text-muted">Paste your raw HTML code below. This will replace the current editor content.</p>
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="<article data-dc-tpl='35' style='...'>...</article>"
                className="flex-1 w-full px-3 py-2 bg-brand-navy border border-white/20 rounded text-text-primary font-mono text-xs focus:outline-none focus:border-brand-gold/40 resize-none"
                dir="ltr"
              />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-white/10">
              <button onClick={() => setShowHtmlImport(false)} className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-primary transition-colors">Cancel</button>
              <button 
                onClick={handleImportHtml} 
                disabled={!htmlInput.trim()}
                className="px-4 py-2 text-xs font-medium bg-brand-gold text-brand-navy rounded hover:bg-brand-gold/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-3 h-3" /> Import Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link input popup */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-brand-navy/80">
          <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="flex-1 px-2 py-1 text-sm bg-brand-navy-dark border border-white/20 rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setLink(); } if (e.key === 'Escape') { setShowLinkInput(false); } }} autoFocus />
          <button onClick={setLink} className="px-3 py-1 text-xs font-medium bg-brand-gold text-brand-navy rounded hover:bg-brand-gold/90 transition-colors">Apply</button>
          <button onClick={() => { if (editor.isActive('link')) editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }} className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors">{editor.isActive('link') ? 'Remove' : 'Cancel'}</button>
        </div>
      )}

      {/* Image input popup */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-brand-navy/80">
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="flex-1 px-2 py-1 text-sm bg-brand-navy-dark border border-white/20 rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-gold/40" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } if (e.key === 'Escape') { setShowImageInput(false); } }} autoFocus />
          <button onClick={addImage} disabled={!imageUrl} className="px-3 py-1 text-xs font-medium bg-brand-gold text-brand-navy rounded hover:bg-brand-gold/90 transition-colors disabled:opacity-50">Insert</button>
          <button onClick={() => setShowImageInput(false)} className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors">Cancel</button>
        </div>
      )}

      {/* Editor content area */}
      <div className={placeholder && editor.isEmpty ? 'relative' : ''}>
        {placeholder && editor.isEmpty && (
          <div className={`absolute top-3 ${direction === 'rtl' ? 'right-4' : 'left-4'} text-text-muted pointer-events-none text-sm`}>{placeholder}</div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/* ────────── Toolbar Sub-components ─────────── */
interface ToolbarButtonProps { onClick: () => void; active?: boolean; disabled: boolean; title: string; children: React.ReactNode; }
function ToolbarButton({ onClick, active = false, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title} aria-label={title} aria-pressed={active} className={`p-1.5 rounded transition-colors ${active ? 'bg-brand-gold/20 text-brand-gold' : 'text-text-muted hover:text-text-primary hover:bg-white/5'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
      {children}
    </button>
  );
}
function ToolbarDivider() { return <div className="w-px h-5 bg-white/10 mx-1" />; }