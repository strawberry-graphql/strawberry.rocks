import "@docsearch/css/dist/style.css";

// import { Analytics } from "@vercel/analytics/react";
// import NProgress from "nprogress";
import type { AppProps } from "next/app";

// import Router from "next/router";
import { Footer } from "~/components/footer";
import { NewsletterSection } from "~/components/newsletter-section";

// import "../styles/nprogress.css";
// import "../styles/tailwind.css";

// Router.events.on("routeChangeStart", () => NProgress.start());
// Router.events.on("routeChangeComplete", () => NProgress.done());
// Router.events.on("routeChangeError", () => NProgress.done());

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="dark:bg-gray-800 text-black dark:text-white">
        {children}
        <NewsletterSection />
        <Footer />
        {/* <Analytics /> */}
      </div>
    </>
  );
}
