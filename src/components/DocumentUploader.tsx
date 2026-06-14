"use client";

import { useState, useRef, useCallback } from "react";

interface DocumentUploaderProps {
  onContentParsed: (html: string, text: string) => void;
}

const ACCEPTED_TYPES = ".pdf,.docx";
const ACCEPTED_MIME = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export default function DocumentUploader({ onContentParsed }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | "docx" | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = useCallback((file: File): boolean => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".pdf") || file.type === "application/pdf") return true;
    if (name.endsWith(".docx")) return true;
    return false;
  }, []);

  const getFileType = useCallback((file: File): "pdf" | "docx" => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".pdf") || file.type === "application/pdf") return "pdf";
    return "docx";
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (!isValidFile(file)) {
      setError("Only PDF (.pdf) and Word (.docx) files are supported");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large (max 10MB)");
      return;
    }

    setError(null);
    setUploading(true);
    setFileName(file.name);
    setFileType(getFileType(file));
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to parse document");
        return;
      }

      setPreview(data.text || "No text extracted from document");
      onContentParsed(data.html || "", data.text || "");
    } catch {
      setError("An error occurred while parsing the document");
    } finally {
      setUploading(false);
    }
  }, [onContentParsed, isValidFile, getFileType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleBrowse}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={handleInputChange}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">
              {fileType === "pdf" ? "Parsing PDF... extracting text..." : "Converting Word document to HTML..."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {/* PDF Icon */}
            {fileName && fileType === "pdf" ? (
              <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
              </svg>
            ) : fileName && fileType === "docx" ? (
              /* Word Icon */
              <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1v5h5M8 13l2 5 2-4 2 4 2-5" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              /* Generic Upload Icon */
              <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {fileName || "Drop file here or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {fileName ? "Click to change file" : "Supports PDF and Word (.docx) - Max 10MB"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Preview */}
      {preview && !uploading && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview Extracted Text
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {preview.substring(0, 2000)}
              {preview.length > 2000 ? "..." : ""}
            </pre>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Content has been loaded into the editor below. You can edit it before saving.
          </p>
        </div>
      )}
    </div>
  );
}
