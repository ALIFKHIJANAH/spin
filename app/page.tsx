'use client'
import NavBar from "@/components/navbar";
import { SpinWheel } from "@/components/spin-wheel"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-gradient-to-b from-[#121212] to-[#121212]">
      <NavBar></NavBar>
      <div className="max-w-5xl w-full space-y-8 mt-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
            Go Spin Name
          </h1>
          <p className="text-lg text-slate-200">
            Add your options and spin the wheel to get a random result!
          </p>
        </div>
        <SpinWheel />
      </div>
    </main>
  );
}

