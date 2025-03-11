import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LessonHeaderProps {
  lessonName: string;
}

export function LessonHeader({ lessonName }: LessonHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white p-4">
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Button>
        </Link>
        <div className="ml-4 flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-800">{lessonName}</h1>
        </div>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>
    </header>
  );
}
