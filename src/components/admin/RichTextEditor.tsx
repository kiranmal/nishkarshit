"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Pilcrow, Quote, Redo2, Underline as UnderlineIcon, Undo2, Unlink } from "lucide-react";

function Btn({ on, active, label, children }: { on: () => void; active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={on}
      className={`p-1.5 rounded ${active ? "bg-brand-navy text-white" : "text-gray-700 hover:bg-gray-200"}`}>{children}</button>
  );
}

/**
 * Rich-text field used by the CMS (blog body, policy pages, …).
 * Output is HTML; the server whitelists it again (lib/cms/html.ts) before storing it.
 */
export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } } })],
    content: value || "",
    immediatelyRender: false,
    editorProps: { attributes: { class: "cms-rich ProseMirror focus:outline-none min-h-[240px] px-4 py-3" } },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
  });

  // Keep the editor in sync when the value is replaced from outside (e.g. "Restore defaults").
  useEffect(() => {
    if (editor && !editor.isFocused && (value || "") !== (editor.isEmpty ? "" : editor.getHTML())) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return <div className="input min-h-[240px] text-sm text-gray-400">Loading editor…</div>;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (https://…, /path, mailto:…)", prev || "https://");
    if (url === null) return;
    if (url.trim() === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  const c = () => editor.chain().focus();

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <Btn label="Paragraph" on={() => c().setParagraph().run()} active={editor.isActive("paragraph")}><Pilcrow size={16} /></Btn>
        <Btn label="Heading 2" on={() => c().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={16} /></Btn>
        <Btn label="Heading 3" on={() => c().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 size={16} /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn label="Bold" on={() => c().toggleBold().run()} active={editor.isActive("bold")}><Bold size={16} /></Btn>
        <Btn label="Italic" on={() => c().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={16} /></Btn>
        <Btn label="Underline" on={() => c().toggleUnderline().run()} active={editor.isActive("underline")}><UnderlineIcon size={16} /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn label="Bullet list" on={() => c().toggleBulletList().run()} active={editor.isActive("bulletList")}><List size={16} /></Btn>
        <Btn label="Numbered list" on={() => c().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={16} /></Btn>
        <Btn label="Quote" on={() => c().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote size={16} /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn label="Add / edit link" on={setLink} active={editor.isActive("link")}><Link2 size={16} /></Btn>
        <Btn label="Remove link" on={() => c().extendMarkRange("link").unsetLink().run()}><Unlink size={16} /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn label="Undo" on={() => c().undo().run()}><Undo2 size={16} /></Btn>
        <Btn label="Redo" on={() => c().redo().run()}><Redo2 size={16} /></Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
