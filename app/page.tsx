'use client'
import NavBar from "@/components/navbar";
import { SpinWheel } from "@/components/spin-wheel"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-gradient-to-b from-[#121212] to-[#121212] overflow-hidden">
      <NavBar></NavBar>
      <div className="max-w-5xl w-full space-y-8 mt-4">
        <SpinWheel />
      </div>
    </main>
  );
}

