import { CodeBackground } from "@/components/code-background";
import {Footer} from "@/modules/home/footer";
import {Header} from "@/modules/home/header";
import { Metadata } from "next";

export const metadata:Metadata = {
    title:{
        template: "Code Playground",
        default:"Code Editor For Smart-Coders",
    },
};

export default function HomeLayout({
    children
}:{
    children:React.ReactNode
}){
    return(
        <div className="relative min-h-screen overflow-hidden">
        <CodeBackground/>
        <Header/>
        <main className="z-20 relative h-full w-full pt-0 md:pt-0">
            {
                children
            }
        </main>
        <Footer/>
        </div>
    )
}
