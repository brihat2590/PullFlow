"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { LogOut, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Repos from "@/components/Repos";
import { ReviewForm } from "@/components/Form";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    toast.success("Logged out successfully");
  };

  const username = session?.user?.name || "User";
  const avatarUrl = session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=user";
  const userEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center ">
            
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
              PULL
            </span>
          </div>

          

          {/* Profile Avatar Dropdown */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full ring-2 ring-gray-800 hover:ring-gray-700 transition-all p-0 overflow-hidden"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback className="bg-gray-800 text-gray-200 font-semibold">
                    {username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-gray-900 border-gray-800 text-gray-200 p-2 shadow-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{username}</p>
                  <p className="text-xs leading-none text-gray-400">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800 my-2" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10 rounded-md py-2.5"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ReviewForm/>

      {/* Main Content */}
      <main className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Repos />
        </div>
        
      </main>
    </div>
  );
}