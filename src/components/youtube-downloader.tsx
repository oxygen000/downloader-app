"use client";

import { useState } from "react";
import { Download, Loader2, AlertCircle, Clipboard } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "react-hot-toast";

export function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [includeSubtitles, setIncludeSubtitles] = useState(false);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      setError("Unable to paste from clipboard");
    }
  };

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!url) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          format: isAudioOnly ? "bestaudio" : selectedQuality,
          withSubs: includeSubtitles,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      toast.success("Download started successfully!");
      window.open(data.file, "_blank");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDownloading(false);
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
                placeholder="Paste YouTube URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
              <Button type="button" onClick={handlePaste} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Clipboard className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="audio-only" checked={isAudioOnly} onCheckedChange={setIsAudioOnly} />
              <Label htmlFor="audio-only" className="text-white">Audio Only (MP3)</Label>
            </div>
            
            {!isAudioOnly && (
              <div className="flex flex-col gap-2">
                <Label className="text-white">Select Video Quality</Label>
                <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Select Quality" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                    <SelectItem value="1080p">1080p (Full HD) - High Quality</SelectItem>
                    <SelectItem value="720p">720p (HD) - Good Quality</SelectItem>
                    <SelectItem value="480p">480p (SD) - Medium Quality</SelectItem>
                    <SelectItem value="360p">360p (SD) - Low Quality</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Switch id="include-subs" checked={includeSubtitles} onCheckedChange={setIncludeSubtitles} />
                  <Label htmlFor="include-subs" className="text-white">Include Subtitles (if available)</Label>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {isAudioOnly ? "Download Audio" : "Download Video"}
                  </>
                )}
              </Button>
            </motion.div>
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
