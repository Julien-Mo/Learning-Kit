import React from "react";
import { IntroductionContent } from "./content/IntroductionContent";
import { WordReadingContent } from "./content/WordReadingContent";
import { PhraseReadingContent } from "./content/PhraseReadingContent";
import { SentenceReadingContent } from "./content/SentenceReadingContent";
import { SpellingContent } from "./content/SpellingContent";
import { WritingActivityContent } from "./content/WritingActivityContent";
import type { LessonContent as LessonContentType } from "@/lib/types";

interface LessonContentProps {
  content: LessonContentType;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isListening: boolean;
  hasListened: boolean;
  handleSpeakText: (text: string) => void;
  handleToggleRecording: () => void;
}

export function LessonContent({
  content,
  userAnswer,
  setUserAnswer,
  isListening,
  hasListened,
  handleSpeakText,
  handleToggleRecording,
}: LessonContentProps) {
  const getRandomItem = <T,>(items: T[]): T => {
    if (!items || items.length === 0) return null as unknown as T;
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };

  const renderTitle = () => {
    switch (content.type) {
      case "introduction":
        return `Learn the letter ${content.letter}`;
      case "wordReading":
      case "phraseReading":
      case "sentenceReading":
      case "spelling":
        return content.title;
      default:
        return "What sound does this make?";
    }
  };

  const renderContent = () => {
    switch (content.type) {
      case "introduction":
        return (
          <IntroductionContent
            letter={content.letter}
            keyword={content.keyword}
            sound={content.sound}
            hasListened={hasListened}
            isListening={isListening}
            onSpeakText={handleSpeakText}
            onToggleRecording={handleToggleRecording}
          />
        );

      case "wordReading":
        return (
          <WordReadingContent
            word={content.words[0]}
            isListening={isListening}
            onToggleRecording={handleToggleRecording}
          />
        );

      case "phraseReading":
        return (
          <PhraseReadingContent
            phrase={content.phrases[0]}
            isListening={isListening}
            onToggleRecording={handleToggleRecording}
          />
        );

      case "sentenceReading":
        return (
          <SentenceReadingContent
            sentence={content.sentences[0]}
            isListening={isListening}
            onToggleRecording={handleToggleRecording}
          />
        );

      case "spelling":
        return (
          <SpellingContent
            onSpeakText={handleSpeakText}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            randomWord={getRandomItem(content.words)}
          />
        );

      case "activity":
        if (content.activityType === "writing") {
          return (
            <WritingActivityContent
              instructions={content.instructions}
              userAnswer={userAnswer}
              onAnswerChange={setUserAnswer}
            />
          );
        }

        return (
          <div className="text-center">
            <p className="text-lg text-gray-700">{content.instructions}</p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-gray-700">Unknown content type</p>
          </div>
        );
    }
  };

  return (
    <>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
        {renderTitle()}
      </h2>
      <div className="mb-8">{renderContent()}</div>
    </>
  );
}
