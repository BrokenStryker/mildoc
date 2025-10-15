import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <main className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Military Document Formatter
          </h1>
          <p className="text-xl text-muted-foreground">
            Rapid AR 25-50 document formatting for Army staff officers
          </p>
        </div>

        <div className="space-y-4 text-lg text-muted-foreground">
          <p>
            Format military correspondence in minutes, not hours. Upload Word or PDF documents,
            restructure paragraphs with drag-and-drop, and export AR 25-50 compliant PDFs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <SignedOut>
            <Link
              href="/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base h-12 px-8 transition-colors flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link
              href="/notion-like"
              className="border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-base h-12 px-8 transition-colors flex items-center justify-center"
            >
              View Demo Editor
            </Link>
          </SignedOut>
          
          <SignedIn>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base h-12 px-8 transition-colors flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/notion-like"
              className="border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-base h-12 px-8 transition-colors flex items-center justify-center"
            >
              View Demo Editor
            </Link>
          </SignedIn>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">🎯 Rapid Formatting</h3>
            <p className="text-sm text-muted-foreground">
              Reduce formatting time from hours to minutes with automated AR 25-50 compliance.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">📝 Block-Based Editing</h3>
            <p className="text-sm text-muted-foreground">
              Drag-and-drop paragraphs, adjust indentation with one click, auto-numbering included.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">🔒 Secure & Local</h3>
            <p className="text-sm text-muted-foreground">
              All documents stored locally in your browser. Your sensitive data never leaves your device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
