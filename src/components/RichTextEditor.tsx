"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  LinkIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readonly?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder,
  readonly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content: value,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      if (!readonly) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px]",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <MenuBar editor={editor} readonly={readonly} />
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm max-w-none",
          // Fixed styling for lists
          "[&_.tiptap]:p-4",
          "[&_.tiptap]:min-h-[150px]",
          "[&_.tiptap]:outline-none",
          "[&_.tiptap_ul]:list-disc",
          "[&_.tiptap_ul]:pl-5",
          "[&_.tiptap_ol]:list-decimal",
          "[&_.tiptap_ol]:pl-5"
        )}
      />
    </div>
  );
}

const MenuBar = ({
  editor,
  readonly,
}: {
  editor: Editor;
  readonly: boolean;
}) => {
  const setLink = () => {
    if (readonly) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const colors = [
    "#000000",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="border-b p-2 flex flex-wrap gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        disabled={readonly}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        disabled={readonly}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        aria-label="Heading 1"
        disabled={readonly}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        aria-label="Heading 2"
        disabled={readonly}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet List"
        disabled={readonly}
      >
        <List className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered List"
        disabled={readonly}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={setLink}
        aria-label="Link"
        disabled={readonly}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>

      {/* Text alignment toggles */}
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
        aria-label="Align Left"
        disabled={readonly}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
        aria-label="Align Center"
        disabled={readonly}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
        aria-label="Align Right"
        disabled={readonly}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "justify" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("justify").run()
        }
        aria-label="Justify"
        disabled={readonly}
      >
        <AlignJustify className="h-4 w-4" />
      </Toggle>

      {/* Color picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Toggle size="sm" aria-label="Text Color" disabled={readonly}>
            <Palette className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-full border focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
                aria-label={`Set text color to ${color}`}
                disabled={readonly}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex gap-1">
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={readonly || !editor.can().undo()}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={readonly || !editor.can().redo()}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
};
