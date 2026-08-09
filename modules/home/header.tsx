import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "../auth/components/user-button";

export function Header() {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50">
        <div className="w-full">
          {/* Rest of the header content */}
          <div className="flex items-center justify-center w-full flex-col">
            <div
              className={
                           `flex items-center justify-between
                            bg-white/80 dark:bg-zinc-950/70
                            shadow-[0_12px_40px_-26px_rgba(15,23,42,0.65)]
                            backdrop-blur-xl
                            border-x border-b 
                            border-zinc-200/80 dark:border-white/10
                            w-full sm:min-w-[800px] sm:max-w-[1200px]
                            rounded-b-lg
                            px-4 py-2.5
                            relative
                            transition-all duration-300 ease-in-out`
                        }
            >
              <div className="relative z-10 flex items-center justify-between w-full gap-2">
                {/* Logo Section with Navigation Links */}
                <div className="flex items-center gap-6 justify-center">
                  <Link
                    href="/"
                    className="flex items-center gap-2 justify-center"
                  >
                    <Image
                      src={"/logo.svg"}
                      alt="Logo"
                      height={60}
                      width={60}
                      style={{ width: "60px", height: "auto" }}
                    />

                    <span className="hidden sm:block font-extrabold text-lg">
                      CodeNova Editor
                    </span>
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  {/* Desktop Navigation Links */}
                  <div className="hidden sm:flex items-center gap-4">
                    <Link
                      href="/docs/components/background-paths"
                      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                      Docs
                    </Link>
                    {/* <Link
                                            href="/pricing"
                                            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                                        >
                                            Pricing
                                        </Link> */}
                    <Link
                      href="https://codesnippetui.pro/templates?utm_source=codesnippetui.com&utm_medium=header"
                      target="_blank"
                      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors flex items-center gap-2"
                    >
                      API
                      <span className="text-green-500 dark:text-green-400 border border-green-500 dark:border-green-400 rounded-lg px-1 py-0.5 text-xs">
                        New
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Right side items */}
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  {/* <HeaderPro /> */}
                  <ThemeToggle />
                  <UserButton/>
                </div>

                {/* Mobile Navigation remains unchanged */}
                <div className="flex sm:hidden items-center gap-4">
                  <Link
                    href="/docs/components/action-search-bar"
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    Docs
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    API
                  </Link>
                  <ThemeToggle />
                  <UserButton/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
