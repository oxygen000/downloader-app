"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RedditDownloaderProps {
  onDownload: (url: string) => void;
  isDownloading: boolean;
}

export function RedditDownloader({ onDownload, isDownloading }: RedditDownloaderProps) {
  const [url, setUrl] = useState("")

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-orange-500">Reddit Downloader</CardTitle>
        <CardDescription>Download videos and GIFs from Reddit posts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter Reddit post URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-gray-700 border-gray-600 text-gray-100"
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => onDownload(url)}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Media
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

