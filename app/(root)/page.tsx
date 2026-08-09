import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bot, Layers3, Play, Sparkles, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
   
  return (
    <div className="relative z-20 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col items-start">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-white/75 px-3 py-1.5 text-sm font-medium text-teal-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-teal-200">
            <Sparkles className="h-4 w-4" />
            AI assisted coding workspace
          </div>

          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-normal text-zinc-950 dark:text-white sm:text-6xl lg:text-7xl">
            CodeNova Editor
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Build, preview, and refine projects in a fast browser-based editor
            with AI help close at hand.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={"/dashboard"}>
              <Button variant={"brand"} className="h-12 px-6 shadow-lg shadow-red-500/20" size={"lg"}>
                Get Started
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            
          </div>

          <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Terminal, label: "Live editor" },
              { icon: Bot, label: "AI suggestions" },
              { icon: Layers3, label: "Starter templates" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"
              >
                <item.icon className="h-4 w-4 text-[#E93F3F]" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-[28rem] items-center justify-center">
          <div className="absolute inset-x-6 top-8 h-48 rounded-lg border border-teal-500/20 bg-teal-500/10 blur-2xl" />
          <div className="relative w-full max-w-md rounded-lg border border-zinc-200/80 bg-white/80 p-4 shadow-2xl shadow-zinc-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 dark:shadow-black/30">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#E93F3F]" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-teal-400" />
              </div>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                app/page.tsx
              </span>
            </div>
            <div className="grid gap-4 pt-5 font-mono text-sm">
              <div className="rounded-md bg-zinc-950 p-4 text-zinc-100">
                <p><span className="text-teal-300">const</span> idea = <span className="text-amber-200">"ship faster"</span>;</p>
                <p className="mt-2"><span className="text-red-300">await</span> CodeNova.build(idea);</p>
              </div>
              <Image
                src={"/hero.svg"}
                alt="CodeNova workspace preview"
                height={260}
                width={360}
                className="mx-auto h-auto w-[78%]"
                priority
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
