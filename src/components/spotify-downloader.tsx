"use client"

import { useState } from "react"
import { Download, Loader2, Music } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SpotifyDownloaderProps {
  onDownload: (url: string) => void;
  isDownloading: boolean;
}

export function SpotifyDownloader({ onDownload, isDownloading }: SpotifyDownloaderProps) {
  const [url, setUrl] = useState("")
  const [selectedQuality, setSelectedQuality] = useState("")

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-green-500">Spotify Downloader</CardTitle>
        <CardDescription>Download tracks or entire playlists from Spotify</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter Spotify URL (track or playlist)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-gray-700 border-gray-600 text-gray-100"
        />
        <Select value={selectedQuality} onValueChange={setSelectedQuality}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
            <SelectValue placeholder="Select Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="320">320 kbps</SelectItem>
            <SelectItem value="256">256 kbps</SelectItem>
            <SelectItem value="192">192 kbps</SelectItem>
            <SelectItem value="128">128 kbps</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white"
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
              Download Track
            </>
          )}
        </Button>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white"
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
              <Music className="w-4 h-4 mr-2" />
              Download Playlist
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

