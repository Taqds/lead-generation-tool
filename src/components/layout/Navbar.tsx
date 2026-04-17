"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Search, List, Download, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="glass border-b sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="mr-8 flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">LeadAudit</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/dashboard" className="flex items-center space-x-2 text-foreground transition-all hover:translate-y-[-1px] hover:text-primary">
            <LayoutDashboard className="h-4 w-4 opacity-70" />
            <span>Dashboard</span>
          </Link>
          <Link href="/campaigns/new" className="flex items-center space-x-2 text-muted-foreground transition-all hover:translate-y-[-1px] hover:text-primary">
            <Search className="h-4 w-4 opacity-70" />
            <span>New Search</span>
          </Link>
          <Link href="/leads" className="flex items-center space-x-2 text-muted-foreground transition-all hover:translate-y-[-1px] hover:text-primary">
            <List className="h-4 w-4 opacity-70" />
            <span>Leads</span>
          </Link>
          <Link href="/exports" className="flex items-center space-x-2 text-muted-foreground transition-all hover:translate-y-[-1px] hover:text-primary">
            <Download className="h-4 w-4 opacity-70" />
            <span>Exports</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <UserIcon className="mr-2 h-4 w-4 opacity-70" />
            Profile
          </Button>
          <Button size="sm" variant="destructive" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </nav>
  );
}
