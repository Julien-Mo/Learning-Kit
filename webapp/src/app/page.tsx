import { Star, Trophy } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/layouts/dashboard-layout";

export default function SoloSpellProfessional() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex">
        <div className="flex-1 max-w-3xl mx-auto py-6 px-8">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 mb-10 shadow-lg shadow-purple-200/50">
            <div className="flex items-center gap-2 text-white/90 mb-2 hover:text-white transition-colors">
              <span className="text-sm font-medium">Section 1, unit 1</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Basic Alphabet
            </h2>
          </div>

          {/* Module 1 */}
          <div className="mb-12">
            <div className="text-center relative mb-8">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10"></div>
              <span className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-2 rounded-full text-gray-700 font-medium text-sm">
                Module 1: The Alphabet
              </span>
            </div>

            <div className="flex flex-col items-center gap-8">
              <Link href="/lesson/1">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200/50 transition-transform duration-200 group-hover:scale-105">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-500 text-xs font-bold w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md">
                    ✓
                  </div>
                </div>
              </Link>

              <Link href="/lesson/0">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200/50 transition-transform duration-200 group-hover:scale-105">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-500 text-xs font-bold w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md">
                    ✓
                  </div>
                </div>
              </Link>

              {[1, 2].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                >
                  <Star className="w-10 h-10 text-gray-300" />
                </div>
              ))}

              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center transition-transform duration-200 hover:scale-105">
                <Trophy className="w-10 h-10 text-gray-300" />
              </div>
            </div>
          </div>

          {/* Module 2 */}
          <div>
            <div className="text-center relative mb-8">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10"></div>
              <span className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-2 rounded-full text-gray-700 font-medium text-sm">
                Module 2: Basic Words
              </span>
            </div>

            <div className="flex flex-col items-center gap-8">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                >
                  <Star className="w-10 h-10 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
