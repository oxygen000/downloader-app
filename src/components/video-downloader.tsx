"use client"

import { useState } from "react"
import { Youtube,  Twitter,  Instagram, Facebook,  Download } from "lucide-react"
import { FaTiktok,FaSpotify,FaReddit} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { YouTubeDownloader } from "@/components/youtube-downloader"
import { SpotifyDownloader } from "@/components/spotify-downloader"
import { TwitterDownloader } from "@/components/twitter-downloader"
import { TikTokDownloader } from "@/components/tiktok-downloader"
import { InstagramDownloader } from "@/components/instagram-downloader"
import { FacebookDownloader } from "@/components/facebook-downloader"
import { ThreadsDownloader } from "@/components/threads-downloader"
import { RedditDownloader } from "@/components/reddit-downloader"
import { OtherDownloader } from "@/components/other-downloader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import React from "react";

const Downloaders: Record<string, React.ElementType> = {
  youtube: YouTubeDownloader,
  spotify: SpotifyDownloader,
  twitter: TwitterDownloader,
  tiktok: TikTokDownloader,
  instagram: InstagramDownloader,
  facebook: FacebookDownloader,
  threads: ThreadsDownloader,
  reddit: RedditDownloader,
  other: OtherDownloader,
};



export function VideoDownloader() {
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("youtube")
  const [recentDownloads, setRecentDownloads] = useState<{ title: string; source: string; quality: string; url: string }[]>([])
  const [error, setError] = useState("")

  const handleDownload = async (platform: string, url: string) => {
    setIsDownloading(true)
    setError("")

    try {
      // Simulating download progress
      for (let i = 0; i <= 100; i += 10) {
        setDownloadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Add to recent downloads
      setRecentDownloads((prev) => [
        { title: `Download from ${platform}`, source: platform, quality: "HD", url },
        ...prev.slice(0, 7), // Keep only the last 8 downloads
      ])
    } catch {
      setError("An error occurred during download. Please try again.")
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Multi-Platform Downloader</CardTitle>
          <CardDescription>Choose a platform to start your download</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="youtube" className="w-full" onValueChange={setSelectedPlatform}>
  <ScrollArea className="w-full rounded-md border border-gray-700 overflow-x-auto">
    <TabsList className="flex flex-wrap justify-center gap-2 bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg">
      {[
        { value: "youtube", color: "bg-red-600", Icon: Youtube, label: "YouTube" },
        { value: "spotify", color: "bg-green-600", Icon: FaSpotify, label: "Spotify" },
        { value: "twitter", color: "bg-sky-600", Icon: Twitter, label: "Twitter" },
        { value: "tiktok", color: "bg-pink-600", Icon: FaTiktok, label: "TikTok" },
        { value: "instagram", color: "bg-purple-600", Icon: Instagram, label: "Instagram" },
        { value: "facebook", color: "bg-blue-700", Icon: Facebook, label: "FaceBook" },
        { value: "threads", color: "bg-gray-600", Icon: FaThreads, label: "Threads" },
        { value: "reddit", color: "bg-orange-600", Icon: FaReddit, label: "Reddit" },
        { value: "other", color: "bg-purple-600", Icon: Download, label: "Other" },
      ].map(({ value, color, Icon, label }) => (
        <TabsTrigger
          key={value}
          value={value}
          className={`flex flex-row items-center justify-start gap-2 ${color} text-white px-2 py-1.5 rounded-md text-xs sm:text-sm transition-all duration-200 hover:bg-opacity-80`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  </ScrollArea>

  <AnimatePresence mode="wait">
    <motion.div
      key={selectedPlatform}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center w-full mt-4"
    >
      {["youtube", "spotify", "twitter", "tiktok", "instagram", "facebook", "threads", "reddit", "other"].map((platform) => {
        const DownloaderComponent = Downloaders[platform];
        return (
          <TabsContent key={platform} value={platform} className="w-full">
            {DownloaderComponent && (
              <DownloaderComponent
                onDownload={(url: string) => handleDownload(platform, url)}
                isDownloading={isDownloading}
              />
            )}
          </TabsContent>
        );
      })}
    </motion.div>
  </AnimatePresence>
</Tabs>






      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {downloadProgress > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle >Download Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Downloading...</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <motion.div
                    className="bg-blue-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700 p-4">
            <div className="space-y-4">
              {recentDownloads.map((download, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div>
                    <p className="font-medium">{download.title}</p>
                    <p className="text-sm text-gray-400">{download.source}</p>
                  </div>
                  <Badge variant="secondary">{download.quality}</Badge>
                </motion.div>
              ))}
              {recentDownloads.length === 0 && <p className="text-gray-400 text-center">No recent downloads</p>}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

