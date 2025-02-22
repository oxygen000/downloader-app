import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const { url, format, withSubs } = await req.json();
    if (!url) return NextResponse.json({ error: "يرجى إدخال رابط يوتيوب" }, { status: 400 });

    // مسار حفظ الملفات داخل `public/downloads`
    const outputPath = path.join(process.cwd(), "public", "downloads", "%(title)s.%(ext)s");

    // تجهيز أمر yt-dlp
    let command = `yt-dlp -f ${format} -o "${outputPath}" ${url}`;

    // إضافة خيار تحميل الترجمة إذا تم تفعيله
    if (withSubs) {
      command += " --write-sub --sub-lang en --convert-subs srt";
    }

    // تنفيذ الأمر بشكل غير متزامن
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error("YT-DLP Error:", stderr);
      return NextResponse.json({ error: "حدث خطأ أثناء التنزيل" }, { status: 500 });
    }

    // البحث عن اسم الملف في الإخراج
    const match = stdout.match(/Destination: (.+)/);
    if (!match) return NextResponse.json({ error: "لم يتم العثور على الملف" }, { status: 500 });

    const fileName = path.basename(match[1].trim());

    return NextResponse.json({ success: true, file: `/downloads/${fileName}` });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
