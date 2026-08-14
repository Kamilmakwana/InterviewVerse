import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "InterviewVerse — Learn .NET Interviews Through Stories",
  description:
    "A premium, offline-first way to master .NET backend interviews. 126 lessons told as stories, with animations, quizzes, flashcards, and a mock interview simulator. No login, no backend.",
  keywords: [
    ".NET interview",
    "C# interview questions",
    "ASP.NET Core",
    "SQL Server",
    "system design",
    "interview preparation",
  ],
  authors: [{ name: "InterviewVerse" }],
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    title: "InterviewVerse — Learn .NET Interviews Through Stories",
    description:
      "Master .NET interviews through stories, animations, and interactive mock interviews.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1117" },
  ],
};

// Set theme before paint to avoid a flash of the wrong theme.
const themeScript = `
(function(){
  try {
    var raw = localStorage.getItem('dotnet-quest-v1');
    var mode = 'system';
    if (raw) { var s = JSON.parse(raw).state; if (s && s.theme) mode = s.theme; }
    var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
