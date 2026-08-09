import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "@/modules/dashboard/components/project-table";
import React from "react";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  const projectCount = playgrounds?.length || 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex w-full flex-col justify-between gap-4 rounded-lg border border-white/60 bg-white/70 p-5 shadow-xl shadow-zinc-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/55 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-[#E93F3F]">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-950 dark:text-white">
            Your CodeNova projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Start fresh, reopen recent work, and keep your coding sessions
            moving from one clean workspace.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-zinc-200/80 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/10">
            <p className="text-zinc-500 dark:text-zinc-400">Projects</p>
            <p className="text-2xl font-bold text-zinc-950 dark:text-white">{projectCount}</p>
          </div>
          <div className="rounded-lg border border-zinc-200/80 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/10">
            <p className="text-zinc-500 dark:text-zinc-400">Mode</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-300">Build</p>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <AddNewButton />
        <AddRepo />
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-center">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <ProjectTable projects={playgrounds || []} />
        )}
      </div>
    </div>
  );
};

export default Page;
