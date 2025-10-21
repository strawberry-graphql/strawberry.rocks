import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import localFont from "next/font/local";

const ranade = localFont({
  src: [
    {
      path: "../public/fonts/Ranade-Variable.ttf",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Ranade-VariableItalic.ttf",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-ranade",
});

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Variable.ttf",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-VariableItalic.ttf",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ranade.variable} ${satoshi.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
