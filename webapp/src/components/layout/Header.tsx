import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white p-4">
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Button>
        </Link>
        <div className="ml-4 flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </div>
        <div className="w-10" />
      </div>
    </header>
  );
} 