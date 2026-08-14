import type { Chapter } from "./types";

/**
 * Chapter metadata — deliberately free of any lesson-content imports so that
 * light pages (landing, nav, footer) can use it without pulling the full
 * lesson library into their bundle.
 */
export const CHAPTERS: Chapter[] = [
  { slug: "csharp", title: "C# Fundamentals", world: "C# Kingdom", tagline: "Types, memory & the language core", emoji: "⚔️", icon: "Braces", color: "#4F8EF7", order: 1 },
  { slug: "oop", title: "OOP & Design", world: "OOP City", tagline: "Pillars, SOLID & patterns", emoji: "🏛️", icon: "Boxes", color: "#7C5CFC", order: 2 },
  { slug: "advanced", title: "Advanced C#", world: "Async Peaks", tagline: "Async, threads, LINQ & collections", emoji: "⛰️", icon: "Zap", color: "#22C55E", order: 3 },
  { slug: "aspnet", title: "ASP.NET Core", world: "ASP.NET Valley", tagline: "MVC, Web API & middleware", emoji: "🌉", icon: "Server", color: "#F59E0B", order: 4 },
  { slug: "entityframework", title: "Entity Framework", world: "EF Harbor", tagline: "ORM, tracking & migrations", emoji: "⚓", icon: "Database", color: "#06B6D4", order: 5 },
  { slug: "sqlserver", title: "SQL Server", world: "SQL Cave", tagline: "Queries, indexes & tuning", emoji: "🗄️", icon: "Table", color: "#EC4899", order: 6 },
  { slug: "azure", title: "Azure & DevOps", world: "Azure Sky", tagline: "Cloud, CI/CD & testing", emoji: "☁️", icon: "Cloud", color: "#3B82F6", order: 7 },
  { slug: "systemdesign", title: "System Design", world: "Architecture Summit", tagline: "Scale, caching & microservices", emoji: "🏔️", icon: "Network", color: "#8B5CF6", order: 8 },
  { slug: "coding", title: "Coding Problems", world: "Algorithm Arena", tagline: "Patterns & problem solving", emoji: "🧩", icon: "Code2", color: "#10B981", order: 9 },
  { slug: "production", title: "Production Scenarios", world: "Production Frontlines", tagline: "Incidents, leaks & debugging", emoji: "🚨", icon: "Activity", color: "#EF4444", order: 10 },
  { slug: "behavioral", title: "Behavioral & Agile", world: "Interview Lounge", tagline: "STAR, Scrum & soft skills", emoji: "🤝", icon: "Users", color: "#F97316", order: 11 },
  { slug: "ai", title: ".NET with AI", world: "AI Laboratory", tagline: "LLMs, RAG & Semantic Kernel", emoji: "🤖", icon: "Sparkles", color: "#A855F7", order: 12 },
];

export function chapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}
