import type { LessonContent } from "@/lib/types";

/**
 * Normalize text for comparison by removing punctuation, extra spaces,
 * and converting to lowercase
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s']|_/g, "") // Remove punctuation except apostrophes
    .replace(/\s+/g, " ")       // Replace multiple spaces with a single space
    .trim();
}

/**
 * Check if two strings are similar enough to be considered a match
 * This is useful for speech recognition which might not be 100% accurate
 */
function isSimilarText(text1: string, text2: string, threshold = 0.8): boolean {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  // For very short answers, use exact matching
  if (normalized1.length < 4 || normalized2.length < 4) {
    return normalized1 === normalized2;
  }
  
  // For longer answers, check if one contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  // Check if the words match
  const words1 = normalized1.split(" ");
  const words2 = normalized2.split(" ");
  
  // If one answer is just a single word, check if it's in the other answer
  if (words1.length === 1) {
    return words2.includes(words1[0]);
  }
  if (words2.length === 1) {
    return words1.includes(words2[0]);
  }
  
  // Count matching words
  const matchingWords = words1.filter(word => words2.includes(word)).length;
  const totalWords = Math.max(words1.length, words2.length);
  
  return matchingWords / totalWords >= threshold;
}

export function checkAnswerCorrectness(
  content: LessonContent,
  userAnswer: string
): boolean {
  if (!content || !userAnswer) return false;

  switch (content.type) {
    case "wordReading":
    case "spelling":
      // Check if the answer is similar to any word
      return (content.words || []).some(
        (word) => isSimilarText(word, userAnswer)
      );

    case "phraseReading":
      return (content.phrases || []).some(
        (phrase) => isSimilarText(phrase, userAnswer)
      );

    case "sentenceReading":
      return (content.sentences || []).some(
        (sentence) => isSimilarText(sentence, userAnswer)
      );

    case "introduction":
      // For introduction, check if they said the keyword
      return (content.keyword || "").split(" ").some(
        keyword => isSimilarText(keyword, userAnswer) || 
                  normalizeText(userAnswer).includes(normalizeText(keyword))
      );

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
