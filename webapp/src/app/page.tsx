import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        SoloSpell
        <a href="/dashboard">go to dashboard</a>
        <a href="/onboarding">go to onboarding</a>
        <a href="/lesson/1">go to lesson with id 1</a>
        <a href="/progress">go to progress</a>
        <a href="/settings">go to settings</a>
        <a href="/profile">go to profile</a>
      </main>
    </div>
  );
}
