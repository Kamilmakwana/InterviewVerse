import { INDEX as LESSONS, type LiteLesson } from "./lite";

export interface Company {
  name: string;
  emoji: string;
  vibe: string;
  focus: string[]; // category slugs they lean on
}

export const COMPANIES: Company[] = [
  { name: "Infosys", emoji: "🟦", vibe: "Fundamentals-first, breadth over depth", focus: ["csharp", "oop", "sqlserver", "aspnet"] },
  { name: "TCS", emoji: "🟪", vibe: "Core concepts, SQL & projects", focus: ["csharp", "sqlserver", "oop", "behavioral"] },
  { name: "Accenture", emoji: "🟣", vibe: "Practical .NET + cloud awareness", focus: ["aspnet", "azure", "oop", "sqlserver"] },
  { name: "Microsoft", emoji: "🟥", vibe: "Deep C#, runtime & system design", focus: ["csharp", "advanced", "systemdesign", "coding"] },
  { name: "Amazon", emoji: "🟧", vibe: "Coding bar + scale + leadership", focus: ["coding", "systemdesign", "behavioral", "advanced"] },
  { name: "Google", emoji: "🔵", vibe: "Algorithms & architecture rigor", focus: ["coding", "systemdesign", "advanced"] },
  { name: "Capgemini", emoji: "🔷", vibe: "Enterprise .NET & delivery", focus: ["aspnet", "entityframework", "sqlserver", "azure"] },
  { name: "Cognizant", emoji: "🟩", vibe: "Full-stack .NET, SQL heavy", focus: ["csharp", "aspnet", "sqlserver", "oop"] },
  { name: "HCL", emoji: "🟨", vibe: "Maintenance & production readiness", focus: ["production", "sqlserver", "aspnet", "azure"] },
  { name: "Wipro", emoji: "🟫", vibe: "Broad fundamentals & Agile", focus: ["csharp", "oop", "behavioral", "sqlserver"] },
  { name: "Deloitte", emoji: "⬛", vibe: "Architecture, cloud & consulting", focus: ["systemdesign", "azure", "aspnet", "behavioral"] },
];

export function lessonsForCompany(company: Company): LiteLesson[] {
  // Prioritise lessons whose author tagged this company, then category focus.
  const tagged = LESSONS.filter((l) => l.companies?.includes(company.name));
  const focusSet = new Set(company.focus);
  const focused = LESSONS.filter(
    (l) => focusSet.has(l.category) && !tagged.includes(l)
  );
  return [...tagged, ...focused];
}

export function companyByName(name: string): Company | undefined {
  return COMPANIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}
