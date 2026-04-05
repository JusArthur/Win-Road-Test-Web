import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MPI Practice Test Winnipeg | Pass Your Manitoba Class 5 Knowledge Test",
  description: "Free mock knowledge tests for the Manitoba Public Insurance (MPI) Class 5 exam. Practice with real questions, road signs, and AI-powered explanations.",
  keywords: "Winnipeg knowledge test, MPI practice test, Manitoba driving test, Class 5 learners, Manitoba road signs quiz, MPI mock test",
  openGraph: {
    title: "Free Manitoba MPI Mock Knowledge Test",
    description: "Prepare for your Winnipeg Class 5 driving exam with our interactive practice tests and AI guidance.",
    url: "https://your-domain.com",
    siteName: "Winnipeg Road Test Prep",
    locale: "en_CA",
    type: "website",
  },
  alternates: {
    canonical: 'https://your-domain.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}