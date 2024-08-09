import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import FloatingText from '@/components/FloatingText';
import StartButton from '@/components/StartButton';

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#0a192f] flex flex-col items-center justify-center relative overflow-hidden">
      <FloatingText />
      <main className="z-10 text-center">
        <div className="w-24 h-24 border-2 border-white rounded-full mb-8 relative mx-auto">
          <div className="absolute top-2 -right-1 w-5 h-0.5 bg-white transform rotate-45"></div>
        </div>
        <h1 className="text-4xl md:text-5xl text-white mb-8 font-semibold">welcome to spinning</h1>
        <StartButton />
      </main>
    </div>
  )
}
