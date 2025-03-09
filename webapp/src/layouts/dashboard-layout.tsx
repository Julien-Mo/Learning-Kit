"use client";
import {
  Zap,
  Lock,
  Settings,
  BarChart2,
  User,
  BookOpen,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar */}
      <div className="w-[240px] !min-w-[240px] border-r bg-white shadow-sm p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-lg shadow-lg shadow-purple-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
            SoloSpell
          </h1>
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-sm ${
              pathname === "/" || pathname.startsWith("/lesson")
                ? "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Learn</span>
          </Link>
          <Link
            href="/progress"
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 ${
              pathname === "/progress"
                ? "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span>Progress</span>
          </Link>
          <Link
            href="/profile"
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 ${
              pathname === "/profile"
                ? "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 ${
              pathname === "/settings"
                ? "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1 flex">
        {/* center area */}
        {children}
        {/* Right Sidebar */}
        <div className="w-[320px] !min-w-[320px] border-l bg-white shadow-sm p-6 space-y-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Hurrah, you're on a streak! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-xl shadow-sm">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-700">3 days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Unlock Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-gray-100 p-2 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-sm">
                  Complete Module 1 to unlock the leaderboard and learn with
                  friends.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Enhance your learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Purchase a learning kit and enhance your reading learning
                abilities.
              </p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md shadow-purple-200 transition-all duration-200 hover:scale-[1.02]">
                Enhance your learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
