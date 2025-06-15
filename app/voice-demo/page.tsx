'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatusBar from '@/components/status-bar';


export default function VoiceDemoPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col">
      <StatusBar />
      <div className="p-4">
        <button onClick={() => router.push('/')} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Custom Voice Widget Demo
        </h1>

        <div className="w-full max-w-md bg-zinc-900/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Standard Button Style
          </h2>
          <p className="text-zinc-400 mb-6 text-center">
            Click the button below to start a voice conversation with Claire
          </p>

          {/*<CustomVoiceWidget*/}
          {/*  agentId="yV4wd6xrm1fUcbFUKJax"*/}
          {/*  characterName="Claire"*/}
          {/*  characterImage="/claire-additional.png"*/}
          {/*/>*/}
        </div>

        <div className="w-full max-w-md bg-zinc-900/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Stylish Button Style
          </h2>
          <p className="text-zinc-400 mb-6 text-center">
            Enhanced version with animations and better UI
          </p>

          {/*<StylishVoiceButton*/}
          {/*  agentId="yV4wd6xrm1fUcbFUKJax"*/}
          {/*  characterName="Claire"*/}
          {/*  characterImage="/claire-additional.png"*/}
          {/*/>*/}
        </div>

        <div className="text-center text-zinc-500 text-sm">
          <p>Powered by ElevenLabs AI</p>
        </div>
      </div>
    </main>
  );
}
