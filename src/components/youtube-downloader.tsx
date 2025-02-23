"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, CheckCircle, Video, Music } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";

interface Format {
  id: string;
  quality: string;
  format: string;
}

interface VideoDetails {
  title: string;
  thumbnail: string;
}

interface ApiResponse {
  formats?: Format[];
  error?: string;
  file?: string;
  videoFormats?: Format[];
  audioFormats?: Format[];
  videoDetails?: VideoDetails;
}

export function YouTubeDownloader() {
  const [url, setUrl] = useState<string>("");
  const [formats, setFormats] = useState<Format[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    fetch("/api/youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format: "auto" }),
    })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }

        const videoFormats = data.videoFormats || [];
        const audioFormats = data.audioFormats || [];
        const allFormats = [...videoFormats, ...audioFormats];

        setFormats(allFormats);
        setVideoDetails(data.videoDetails || null);
      })
      .catch(() => toast.error("Failed to fetch video formats"));
  }, [url]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !selectedFormat || (selectedFormat === "mp4" && !selectedQuality)) {
      toast.error("Please enter a URL and select a format/quality");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format: selectedFormat, quality: selectedQuality }),
      });

      const data: ApiResponse = await response.json();
      if (data.error) throw new Error(data.error);

      toast.success("Download ready!");
      setDownloadLink(data.file || null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      toast.error("Unable to paste from clipboard");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-red-500">YouTube Downloader</CardTitle>
          <CardDescription>Download videos or extract audio from YouTube</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleDownload} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
              <Button type="button" onClick={handlePaste} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Clipboard className="w-4 h-4" />
              </Button>
            </div>

            {videoDetails && (
              <div className="mt-4 text-center">
                <Image src={videoDetails.thumbnail} alt="Thumbnail" width={256} height={144} className="rounded-lg mx-auto" />
                <p className="mt-2 font-semibold">{videoDetails.title}</p>
              </div>
            )}

            {/* اختيار الصيغة */}
            <Select value={selectedFormat} onValueChange={(value) => { setSelectedFormat(value); setSelectedQuality(""); }}>
  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100 flex items-center">
    <SelectValue placeholder="Select Format" />
  </SelectTrigger>
  <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
    <SelectItem value="mp4">
      <div className="flex items-center gap-2">
        <Video className="w-5 h-5 text-blue-400" />
        <span>MP4 (Video)</span>
      </div>
    </SelectItem>
    <SelectItem value="mp3">
      <div className="flex items-center gap-2">
        <Music className="w-5 h-5 text-green-400" />
        <span>MP3 (Audio)</span>
      </div>
    </SelectItem>
  </SelectContent>
</Select>


            {/* اختيار الجودة بناءً على الصيغة المختارة */}
            {formats.length > 0 ? (
              <Select value={selectedQuality} onValueChange={(value) => setSelectedQuality(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Quality" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                  {formats.map((fmt) => (
                    <SelectItem key={fmt.id} value={fmt.id}>
                      {fmt.quality || "Unknown Quality"} ({fmt.format})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-400 text-sm">No formats available</p>
            )}

            <Button type="submit" disabled={isDownloading} className="w-full bg-red-600 text-white flex items-center justify-center">
              {isDownloading ? "Downloading..." : <><Download className="w-4 h-4 mr-2" /> Download</>}
            </Button>

            {downloadLink && (
              <a href={downloadLink} download className=" text-center bg-green-600 text-white py-2 rounded-lg mt-4 flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" /> Download File
              </a>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-400">
            By using this service, you agree to comply with YouTube&apos;s terms of service.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
