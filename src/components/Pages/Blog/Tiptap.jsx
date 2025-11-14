import React, { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import Youtube from "@tiptap/extension-youtube";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

const Tiptap = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
      }),
      Image,
      Highlight,
      Color,
      Youtube.configure({
        width: 640,
        height: 360,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // IMAGE UPLOAD HANDLER
  const addImage = useCallback(() => {
    const url = window.prompt("Paste image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // YOUTUBE VIDEO HANDLER
  const addYoutube = useCallback(() => {
    const url = window.prompt("Paste YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      });
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-xl">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">

        <button onClick={() => editor.chain().focus().toggleBold().run()}
          className="toolbar-btn">Bold</button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}
          className="toolbar-btn">Italic</button>

        <button onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="toolbar-btn">Underline</button>

        <button onClick={() => editor.chain().focus().toggleStrike().run()}
          className="toolbar-btn">Strike</button>

        {/* Headings */}
        {[1,2,3,4,5,6].map(level => (
          <button key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            className="toolbar-btn"
          >
            H{level}
          </button>
        ))}

        {/* Lists */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="toolbar-btn">• List</button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="toolbar-btn">1. List</button>

        {/* Blockquote */}
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="toolbar-btn">❝ Quote</button>

        {/* Code block */}
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="toolbar-btn">Code</button>

        {/* Alignment */}
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="toolbar-btn">Left</button>

        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="toolbar-btn">Center</button>

        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="toolbar-btn">Right</button>

        {/* Color */}
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />

        {/* Image */}
        <button onClick={addImage} className="toolbar-btn">🖼 Image</button>

        {/* YouTube */}
        <button onClick={addYoutube} className="toolbar-btn">▶ YouTube</button>

        {/* Table */}
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
          className="toolbar-btn">Table</button>

        {/* Undo/Redo */}
        <button onClick={() => editor.chain().focus().undo().run()}
          className="toolbar-btn">↺ Undo</button>

        <button onClick={() => editor.chain().focus().redo().run()}
          className="toolbar-btn">↻ Redo</button>
      </div>

      <EditorContent editor={editor} className="p-4 min-h-[300px]" />
    </div>
  );
};

export default Tiptap;
