export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface FollowUp {
  question: string;
  answer: string;
}

export interface Story {
  setup: string;
  scenes: string[];
  moral: string;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface MemoryHack {
  emoji: string;
  oneLiner: string;
  mnemonic: string;
  memoryPalace: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: Difficulty;
  estimatedTime: number;
  emoji: string;
  icon: string;
  tags: string[];
  keywords: string[];
  companies: string[];
  interviewQuestion: string;
  story: Story;
  analogy: string;
  animation: string;
  explanation: string;
  interviewAnswerShort: string;
  interviewAnswerDetailed: string;
  codeExample: CodeExample;
  mistakes: string[];
  followUps: FollowUp[];
  memoryHack: MemoryHack;
  bestPractices: string[];
  performanceTips: string[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  revision30: string;
  revision2min: string;
  challenge: string;
  related: string[];
  summary: string;
}

export interface Chapter {
  slug: string;
  title: string;
  world: string;
  tagline: string;
  emoji: string;
  icon: string;
  color: string; // tailwind rgb var name or hex accent
  order: number;
}

export type MasteryLevel = "new" | "learning" | "practicing" | "mastered";
