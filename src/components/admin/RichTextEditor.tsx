import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Undo, Redo,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  onEmbedImage: () => Promise<string | null>;
};

export function RichTextEditor({ value, onChange, onEmbedImage }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  }

  function block(tag: string) {
    exec("formatBlock", tag);
  }

  async function embedImage() {
    const url = await onEmbedImage();
    if (url) exec("insertImage", url);
  }

  function insertLink() {
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    exec("createLink", url);
  }

  const Btn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className="p-2 rounded text-white/70 hover:bg-white/10 hover:text-white transition"
    >
      {children}
    </button>
  );

  return (
    <div className={`rounded-lg border ${hasFocus ? "border-[color:var(--brand)]" : "border-white/10"} bg-[#0b1220] overflow-hidden transition`}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 px-2 py-1 bg-[#0f172a]">
        <Btn onClick={() => exec("bold")} title="Bold"><Bold className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("italic")} title="Italic"><Italic className="h-4 w-4" /></Btn>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <Btn onClick={() => block("h1")} title="Heading 1"><Heading1 className="h-4 w-4" /></Btn>
        <Btn onClick={() => block("h2")} title="Heading 2"><Heading2 className="h-4 w-4" /></Btn>
        <Btn onClick={() => block("h3")} title="Heading 3"><Heading3 className="h-4 w-4" /></Btn>
        <Btn onClick={() => block("p")} title="Paragraph"><span className="text-xs font-semibold px-1">P</span></Btn>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <Btn onClick={() => exec("insertUnorderedList")} title="Bulleted list"><List className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered className="h-4 w-4" /></Btn>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <Btn onClick={insertLink} title="Insert link"><LinkIcon className="h-4 w-4" /></Btn>
        <Btn onClick={embedImage} title="Embed image"><ImageIcon className="h-4 w-4" /></Btn>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <Btn onClick={() => exec("undo")} title="Undo"><Undo className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("redo")} title="Redo"><Redo className="h-4 w-4" /></Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="prose-rte min-h-[360px] max-h-[70vh] overflow-y-auto px-4 py-3 text-white focus:outline-none"
      />
      <style>{`
        .prose-rte h1 { font-size: 1.75rem; font-weight: 700; margin: 0.8em 0 0.4em; }
        .prose-rte h2 { font-size: 1.4rem; font-weight: 700; margin: 0.8em 0 0.4em; }
        .prose-rte h3 { font-size: 1.15rem; font-weight: 600; margin: 0.8em 0 0.4em; }
        .prose-rte p  { margin: 0.5em 0; line-height: 1.6; }
        .prose-rte ul, .prose-rte ol { margin: 0.5em 0 0.5em 1.5em; }
        .prose-rte ul { list-style: disc; }
        .prose-rte ol { list-style: decimal; }
        .prose-rte a  { color: #FDBA34; text-decoration: underline; }
        .prose-rte img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5em 0; }
        .prose-rte:empty::before { content: 'Start writing your post…'; color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
