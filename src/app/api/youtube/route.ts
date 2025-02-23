import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";


const execPromise = promisify(exec);
const downloadsDir = path.join(process.cwd(), "public", "downloads");
const uniqueName = uuidv4();

// دالة لتحليل الجودات المتاحة وتصنيفها إلى فيديو وصوت
function parseFormats(output: string) {
  const lines = output.split("\n").slice(3); // تجاهل العناوين
  const videoFormats: { id: string; quality: string }[] = [];
  const audioFormats: { id: string; quality: string }[] = [];

  lines.forEach((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2 || isNaN(Number(parts[0]))) return;

    const id = parts[0];
    const quality = parts.slice(1).join(" ");

    if (quality.toLowerCase().includes("audio")) {
      audioFormats.push({ id, quality });
    } else {
      videoFormats.push({ id, quality });
    }
  });

  return { videoFormats, audioFormats };
}

export async function POST(req: Request) {
  try {
    const { url, format, withSubs } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "يرجى إدخال رابط يوتيوب" }, { status: 400 });
    }

    // **جلب قائمة الجودات المتاحة**
    if (format === "auto") {
      const { stdout } = await execPromise(`yt-dlp -F ${url}`);
      const { videoFormats, audioFormats } = parseFormats(stdout);
      return NextResponse.json({ videoFormats, audioFormats });
    }

    // **التحقق من صحة الفورمات**
    if (!format || typeof format !== "string") {
      return NextResponse.json({ error: "يجب تحديد جودة صحيحة" }, { status: 400 });
    }

    // **إنشاء مجلد التنزيلات إذا لم يكن موجودًا**
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const outputPath = path.join(downloadsDir, `${uniqueName}-%(title)s.%(ext)s`);
    
    let command = "";

    if (format === "mp3") {
      // تحميل الصوت فقط بصيغة MP3
      command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" ${url}`;
    } else {
      // تحميل الفيديو أو الصوت المحدد
      command = `yt-dlp -f ${format} -o "${outputPath}" ${url}`;
    }

    if (withSubs) {
      command += " --write-auto-sub --sub-lang all --convert-subs srt";
    }

    await execPromise(command);

    // **البحث عن الملف المحمّل (MP3 أو MP4)**
    const files = fs.readdirSync(downloadsDir);
    const downloadedFile = files.find((file) => file.endsWith(".mp4") || file.endsWith(".mp3"));

    if (!downloadedFile) {
      return NextResponse.json({ error: "فشل العثور على الملف بعد التحميل" }, { status: 500 });
    }

    return NextResponse.json({ success: true, file: `/downloads/${downloadedFile}` });
  } catch (error: unknown) {
    console.error("Server Error:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// **📌 تقديم الملف كـ Stream**
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileName = url.searchParams.get("file");

  if (!fileName) {
    return NextResponse.json({ error: "اسم الملف غير موجود" }, { status: 400 });
  }

  const filePath = path.join(downloadsDir, fileName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  }

  // **تحديد نوع المحتوى بناءً على الامتداد**
  const contentType = fileName.endsWith(".mp3") ? "audio/mpeg" : "video/mp4";

  // تحويل `fs.createReadStream()` إلى `ReadableStream`
  const fileStream = fs.createReadStream(filePath);
  const readableStream = new ReadableStream({
    start(controller) {
      fileStream.on("data", (chunk) => controller.enqueue(chunk));
      fileStream.on("end", () => controller.close());
      fileStream.on("error", (err) => controller.error(err));
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
