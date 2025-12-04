'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

type JSONContent = Record<string, any>;

type RichTextEditorProps = {
  id?: string;
  value?: JSONContent | null;
  onChange: (value: { doc: JSONContent; text: string }) => void;
  className?: string;
  placeholder?: string;
};

export default function RichTextEditor({
  id,
  value,
  onChange,
  className,
  placeholder,
}: RichTextEditorProps) {
  const attributes: Record<string, string> = {
    class: 'rich-text-editor-content',
  };

  if (id) {
    attributes.id = id;
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing…',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const doc = editor.getJSON() as JSONContent;
      const text = editor.getText().trim();
      onChange({ doc, text });
    },
    editorProps: {
      attributes,
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value) {
      editor.commands.setContent(value);
    } else {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  if (!editor) return null;

  const toggle = (command: () => void) => {
    command();
  };

  return (
    <div className="rich-text-editor-root">
      <div className="rich-text-editor-toolbar">
        <button
          type="button"
          onClick={() => toggle(() => editor.chain().focus().toggleBold().run())}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => toggle(() => editor.chain().focus().toggleItalic().run())}
          className={editor.isActive('italic') ? 'active' : ''}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => toggle(() => editor.chain().focus().toggleBulletList().run())}
          className={editor.isActive('bulletList') ? 'active' : ''}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => toggle(() => editor.chain().focus().toggleOrderedList().run())}
          className={editor.isActive('orderedList') ? 'active' : ''}
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => toggle(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => toggle(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() =>
            toggle(() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run(),
            )
          }
        >
          Table
        </button>
      </div>
      <div className={className}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}


