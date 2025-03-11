import type { LessonContent } from "@/lib/types";

export function checkAnswerCorrectness(
  content: LessonContent,
  userAnswer: string
): boolean {
  if (!content || !userAnswer) return false;

  switch (content.type) {
    case "wordReading":
    case "spelling":
      // Check if the answer matches any word
      return (content.words || []).some(
        (word) => word.toLowerCase() === userAnswer.toLowerCase()
      );

    case "phraseReading":
      return (content.phrases || []).some(
        (phrase) => phrase.toLowerCase() === userAnswer.toLowerCase()
      );

    case "sentenceReading":
      return (content.sentences || []).some(
        (sentence) => sentence.toLowerCase() === userAnswer.toLowerCase()
      );

    case "introduction":
      // For introduction, check if they said the keyword
      return userAnswer
        .toLowerCase()
        .includes(content.keyword.toLowerCase());

    case "activity":
      if (content.activityType === "writing") {
        // For writing activities, just check if they typed something
        return userAnswer.trim().length > 0;
      }
      return true;

    default:
      // For other types, just set as correct for demo purposes
      return true;
  }
}

export function isCheckDisabled(
  content: LessonContent,
  hasListened: boolean,
  userAnswer: string
): boolean {
  if (!content) return true;
  
  if (content.type === "introduction" && !hasListened) {
    return true;
  }
  
  if (content.type === "spelling" && !hasListened) {
    return true;
  }
  
  return userAnswer.trim() === "";
}

export function getRandomItemFromArray<T>(items: T[] | undefined): T | null {
  if (!items || items.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
