import { Button } from "@/components/ui/button";

interface FooterProps {
  feedback: string;
  isCorrect: boolean;
  onNext: () => void;
}

export function Footer({ feedback, isCorrect, onNext }: FooterProps) {
  const buttonStyles = isCorrect
    ? "bg-blue-500 text-white hover:bg-blue-600"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <footer className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center">
        <div className="w-[140px]" />
        <div className="flex-1 text-center">
          {feedback && (
            <p className="text-xl font-medium text-gray-700">{feedback}</p>
          )}
        </div>
        <div className="w-[140px] flex justify-end">
          <Button
            className={`h-14 rounded-full px-8 py-4 text-lg font-medium shadow-md transition-colors ${buttonStyles}`}
            onClick={onNext}
          >
            {isCorrect ? "Next" : "Skip"}
          </Button>
        </div>
      </div>
    </footer>
  );
} 