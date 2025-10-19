"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import SignOutButton from "@/components/signout-button";
import { cn } from "@/lib/utils";

type AdminNavItem = {
  href: string;
  label: string;
};

type AdminShellProps = {
  children: ReactNode;
  navItems: AdminNavItem[];
};

export default function AdminShell({ children, navItems }: AdminShellProps) {
  const pathname = usePathname();

  const NavLinks = ({ closeOnClick }: { closeOnClick?: boolean }) => (
    <nav className="flex flex-col space-y-2">
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href;
        const linkButton = (
          <Button
            asChild
            variant="ghost"
            className={cn(
              "justify-start",
              isActive && "bg-muted font-semibold"
            )}
          >
            <Link href={href}>{label}</Link>
          </Button>
        );

        if (closeOnClick) {
          return (
            <SheetClose asChild key={href}>
              {linkButton}
            </SheetClose>
          );
        }

        return (
          <div key={href}>
            {linkButton}
          </div>
        );
      })}
      <div className="border-t pt-2">
        <SignOutButton />
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-muted/30 p-4 md:block">
        <NavLinks />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-full flex-col">
                <div className="border-b px-6 py-4 text-lg font-semibold">
                  Admin navigation
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <NavLinks closeOnClick />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-base font-semibold">Admin</span>
          <div className="w-10" aria-hidden />
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
