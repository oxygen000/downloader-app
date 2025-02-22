import { VideoDownloader } from "@/components/video-downloader"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <main className="container mx-auto p-4">
        <h1 className="text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Video Downloader Pro
        </h1>
        <VideoDownloader />
      </main>
    </div>
  )
}

