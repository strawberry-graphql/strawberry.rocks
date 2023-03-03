import "@strawberry-graphql/styleguide/dist/index.css";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import NProgress from "nprogress";

import Router from "next/router";

import { Footer } from "~/components/footer";
import { NewsletterSection } from "~/components/newsletter-section";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="dark:bg-gray-800 text-black dark:text-white">
        <Component {...pageProps} />
        <NewsletterSection />
        <Footer />
        <Analytics />
      </div>
    </>
  );
}
