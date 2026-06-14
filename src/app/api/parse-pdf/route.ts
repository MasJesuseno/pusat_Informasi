import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

type FileType = "pdf" | "docx" | "unknown";

function detectFileType(fileName: string, mimeType: string): FileType {
  const name = fileName.toLowerCase();
  if (name.endsWith(".pdf") || mimeType === "application/pdf") return "pdf";
  if (name.endsWith(".docx") || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  // Also accept older mime types for docx
  if (mimeType === "application/octet-stream" && name.endsWith(".docx")) return "docx";
  return "unknown";
}

function getExtension(fileType: FileType): string {
  switch (fileType) {
    case "pdf": return ".pdf";
    case "docx": return ".docx";
    default: return ".bin";
  }
}

export async function POST(request: Request) {
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "HR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = detectFileType(file.name, file.type);
    if (fileType === "unknown") {
      return NextResponse.json({
        error: "Only PDF (.pdf) and Word (.docx) files are supported",
        details: `Received type: "${file.type}", name: "${file.name}"`,
      }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = "";
    let htmlContent = "";
    let parseError: string | null = null;

    if (fileType === "pdf") {
      // Parse PDF
      try {
        const parser = new PDFParse({ data: buffer });
        try {
          const result = await parser.getText();
          extractedText = result.text || "";
        } finally {
          await parser.destroy();
        }
      } catch (parseErr: any) {
        parseError = parseErr?.message || "Unknown PDF parse error";
        console.error("pdf-parse error:", parseErr);
      }

      if (parseError) {
        return NextResponse.json({
          error: "Gagal memproses PDF. Mungkin file ini adalah hasil scan (gambar, tanpa teks) atau format PDF tidak didukung.",
          details: parseError,
        }, { status: 422 });
      }

      if (!extractedText.trim()) {
        return NextResponse.json({
          error: "Tidak ada teks yang bisa diekstrak dari PDF ini. Mungkin file ini berisi gambar (scan) tanpa lapisan teks.",
          text: "",
          html: "",
          fileUrl: null,
          fileName: file.name,
        }, { status: 422 });
      }

      // Convert plain text to basic HTML (PDF)
      const paragraphs = extractedText
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0 && !/^--\s*\d+\s+of\s+\d+\s*--$/.test(p.trim()));

      htmlContent = paragraphs
        .map((p: string) => {
          const processed = p.replace(/\n/g, "<br />");
          return `<p>${processed}</p>`;
        })
        .join("\n");
    } else {
      // Parse DOCX with mammoth
      try {
        const result = await mammoth.convertToHtml({ buffer });
        htmlContent = result.value;
        // Extract plain text from HTML for preview
        extractedText = htmlContent.replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, "\"")
          .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
          .replace(/\s+/g, " ")
          .trim();

        if (result.messages?.length) {
          console.warn("mammoth warnings:", result.messages);
        }
      } catch (parseErr: any) {
        parseError = parseErr?.message || "Unknown DOCX parse error";
        console.error("mammoth error:", parseErr);
      }

      if (parseError) {
        return NextResponse.json({
          error: "Gagal memproses file Word. Pastikan file adalah .docx yang valid.",
          details: parseError,
        }, { status: 422 });
      }

      if (!extractedText.trim()) {
        return NextResponse.json({
          error: "Tidak ada teks yang bisa diekstrak dari file Word ini.",
          text: "",
          html: "",
          fileUrl: null,
          fileName: file.name,
        }, { status: 422 });
      }
    }

    // Store the file for reference
    await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });
    const ext = getExtension(fileType);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filepath = join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      text: extractedText,
      html: htmlContent,
      fileUrl,
      fileName: file.name,
      fileType,
    });
  } catch (error: any) {
    console.error("Parse document error:", error);
    return NextResponse.json({
      error: "Gagal memproses file. Error: " + (error?.message || "Unknown error"),
    }, { status: 500 });
  }
}
