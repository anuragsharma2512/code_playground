
"use client";

import { Button } from "@/components/ui/button"
// import { createPlayground } from "@/features/playground/actions";
import { Plus } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";
import TemplateSelectingModal from "./template-selecting-model";
import { createPlayground } from "../actions";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  } | null>(null)
  const router = useRouter()


  const handleSubmit = async (data:{
      title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  })=>{
    setSelectedTemplate(data)

    const res = await createPlayground(data);
    toast.success("Playground Created successfully"
      
    )
    setIsModalOpen(false)
    router.push(`/playground/${res?.id}`)
  }


  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex cursor-pointer flex-row items-center justify-between overflow-hidden rounded-lg border border-zinc-200/80 bg-white/80 px-6 py-6 shadow-lg shadow-zinc-950/5 backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#E93F3F]/60 hover:shadow-2xl hover:shadow-red-500/10 dark:border-white/10 dark:bg-zinc-950/60"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#E93F3F] via-amber-400 to-teal-400" />
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center border-[#E93F3F]/25 bg-[#E93F3F]/10 text-[#E93F3F] transition-colors duration-300 group-hover:border-[#E93F3F] group-hover:bg-[#E93F3F] group-hover:text-white dark:bg-[#E93F3F]/15"
            size={"icon"}
          >
            <Plus size={30} className="transition-transform duration-300 group-hover:rotate-90" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-zinc-950 dark:text-white">Add New</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Create a new playground</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/add-new.svg"}
            alt="Create new playground"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
      <TemplateSelectingModal
      isOpen={isModalOpen}
      onClose={()=>setIsModalOpen(false)}
      onSubmit={handleSubmit}
      />
   
    </>
  )
}

export default AddNewButton
