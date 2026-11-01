import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

// App shell top bar (DesignSystem.md section 2). This is the slim version used
// before login: app name and theme toggle. The step indicator, quota indicator
// and account menu are added with the logged-in workspace.
export function TopBar({ appName, children }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-4 px-4 md:px-6">
        <Link href="/" className="rounded-md" aria-label={`${appName} หน้าแรก`}>
          <Logo name={appName} />
        </Link>
        <div className="flex flex-1 items-center justify-end gap-2">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
