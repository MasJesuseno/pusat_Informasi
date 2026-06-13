"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

const optionLabels = ["A", "B", "C", "D"];

function NewQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionGroupId = searchParams.get("questionGroupId") || "";

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "Tulis pertanyaan disini..." }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[180px] px-4 py-3 text-gray-900",
      },
    },
  });

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url && editor) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [editor]);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  const handleQuestionImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          setImageUrl(data.url);
        }
      } catch {
        alert("Upload failed");
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionGroupId) {
      alert("No question group selected");
      return;
    }
    if (options.some((o) => !o.trim())) {
      alert("All 4 options must be filled");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionGroupId: Number(questionGroupId),
          content,
          imageUrl: imageUrl || null,
          order,
          correctOptionIndex,
          options: options.map((opt, i) => ({ index: i, content: opt })),
        }),
      });
      if (res.ok) {
        router.push(`/enter/questions?questionGroupId=${questionGroupId}`);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create question");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const ToolBtn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="px-5 py-3 text-white font-semibold" style={{ backgroundColor: settings.hero_bg_color_start }}>
          Create Question
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 space-y-6">
            {/* Question Content (Rich Text) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Content *</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
                  <ToolBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                  </ToolBtn>
                  <ToolBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                  </ToolBtn>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <ToolBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="Heading 2">
                    <span className="text-xs font-bold">H2</span>
                  </ToolBtn>
                  <ToolBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="Heading 3">
                    <span className="text-xs font-bold">H3</span>
                  </ToolBtn>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <ToolBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet List">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                  </ToolBtn>
                  <ToolBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Ordered List">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                  </ToolBtn>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <ToolBtn onClick={handleImageUpload} title="Insert Image in Question">
                    {uploading ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </ToolBtn>
                </div>
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Question Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Image (optional)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleQuestionImageUpload}
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {uploadingImage ? "Uploading..." : "Choose Image"}
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              {imageUrl && (
                <img src={imageUrl} alt="Question" className="mt-2 max-h-32 rounded-lg border border-gray-200" />
              )}
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Options */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-1">Answer Options</h3>
              <p className="text-sm text-gray-500 mb-4">Enter all 4 options for the multiple choice question.</p>
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        i === correctOptionIndex
                          ? "bg-green-100 border-green-400 text-green-700"
                          : "bg-gray-50 border-gray-300 text-gray-600"
                      }`}
                    >
                      {optionLabels[i]}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[i] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${optionLabels[i]}`}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setCorrectOptionIndex(i)}
                      className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        i === correctOptionIndex
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {i === correctOptionIndex ? "✓ Correct" : "Set as Correct"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-gray-200 pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewQuestionPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">Loading...</p></div>}>
      <NewQuestionForm />
    </Suspense>
  );
}
