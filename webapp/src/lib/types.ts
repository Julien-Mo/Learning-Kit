// types.ts
export type LessonContent =
  | IntroductionContent
  | ActivityContent
  | WordReadingContent
  | PhraseReadingContent
  | SentenceReadingContent
  | SpellingContent;

export interface IntroductionContent {
  type: "introduction";
  letter: string;
  sound: string;
  keyword: string;
  description: string;
}

export interface ActivityContent {
  type: "activity";
  activityType: "writing" | "speaking" | "listening" | "matching";
  instructions: string;
}

export interface WordReadingContent {
  type: "wordReading";
  title: string;
  words: string[];
}

export interface PhraseReadingContent {
  type: "phraseReading";
  title: string;
  phrases: string[];
}

export interface SentenceReadingContent {
  type: "sentenceReading";
  title: string;
  sentences: string[];
}

export interface SpellingContent {
  type: "spelling";
  title: string;
  words: string[];
}

export interface Lesson {
  id: number;
  name: string;
  content: LessonContent[];
}

export interface LessonsData {
  lessons: Lesson[];
}
