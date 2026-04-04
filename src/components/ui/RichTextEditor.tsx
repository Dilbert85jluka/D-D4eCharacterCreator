import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { useEffect, useCallback, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false, // use standalone extension
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      Image,
      HorizontalRule,
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-text-content outline-none min-h-[120px] px-3 py-2',
      },
    },
  });

  // Sync content from parent if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  return (
    <div className="border border-stone-300 rounded-xl overflow-hidden bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {!content && placeholder && (
        <div className="px-3 py-2 text-stone-400 text-sm pointer-events-none absolute">
          {placeholder}
        </div>
      )}
    </div>
  );
}

// ── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) return null;

  const btn = (
    active: boolean,
    onClick: () => void,
    label: string,
    title: string,
  ) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={[
        'px-2 py-1.5 text-xs font-semibold rounded transition-colors min-w-[28px] min-h-[32px]',
        active
          ? 'bg-amber-600 text-white'
          : 'text-stone-600 hover:bg-stone-100',
      ].join(' ')}
      title={title}
    >
      {label}
    </button>
  );

  const sep = () => (
    <div className="w-px h-5 bg-stone-200 mx-0.5 flex-shrink-0" />
  );

  const addLink = useCallback(() => {
    if (linkUrl) {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  return (
    <div className="bg-stone-50 border-b border-stone-200 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
      {/* Text formatting */}
      {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'B', 'Bold')}
      {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'I', 'Italic')}
      {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'U', 'Underline')}
      {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'S', 'Strikethrough')}
      {sep()}

      {/* Block types */}
      {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'H1', 'Heading 1')}
      {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', 'Heading 2')}
      {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', 'Heading 3')}
      {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), '"', 'Blockquote')}
      {btn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), '</>', 'Code Block')}
      {sep()}

      {/* Lists */}
      {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '\u2022', 'Bullet List')}
      {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '1.', 'Numbered List')}
      {sep()}

      {/* Alignment */}
      {btn(editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), '\u2261', 'Align Left')}
      {btn(editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), '\u2263', 'Align Center')}
      {btn(editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), '\u2262', 'Align Right')}
      {sep()}

      {/* Insert */}
      {btn(false, () => editor.chain().focus().setHorizontalRule().run(), '---', 'Horizontal Rule')}
      {btn(editor.isActive('link'), () => {
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run();
        } else {
          setShowLinkInput(true);
        }
      }, '\u{1F517}', 'Link')}
      {btn(false, addImage, '\u{1F5BC}', 'Image')}
      {btn(false, addTable, '\u{1F4CB}', 'Table')}

      {/* Table controls — only when inside a table */}
      {editor.isActive('table') && (
        <>
          {sep()}
          {btn(false, () => editor.chain().focus().addRowAfter().run(), '+Row', 'Add Row')}
          {btn(false, () => editor.chain().focus().addColumnAfter().run(), '+Col', 'Add Column')}
          {btn(false, () => editor.chain().focus().deleteRow().run(), '-Row', 'Delete Row')}
          {btn(false, () => editor.chain().focus().deleteColumn().run(), '-Col', 'Delete Column')}
          {btn(false, () => editor.chain().focus().deleteTable().run(), 'Del', 'Delete Table')}
        </>
      )}

      {/* Color picker */}
      {sep()}
      <label className="flex items-center gap-1 cursor-pointer" title="Text Color">
        <span className="text-xs text-stone-500">A</span>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-5 h-5 border-0 bg-transparent cursor-pointer"
          value={editor.getAttributes('textStyle').color || '#000000'}
        />
      </label>

      {/* Link input popover */}
      {showLinkInput && (
        <div className="flex items-center gap-1 ml-2 bg-white border border-stone-300 rounded-lg px-2 py-1">
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
            className="text-sm border-none outline-none w-48"
            autoFocus
          />
          <button onClick={addLink} className="text-xs font-bold text-amber-700 px-2 py-1 hover:bg-amber-50 rounded">Add</button>
          <button onClick={() => { setShowLinkInput(false); setLinkUrl(''); }} className="text-xs text-stone-400 px-1">Cancel</button>
        </div>
      )}
    </div>
  );
}
