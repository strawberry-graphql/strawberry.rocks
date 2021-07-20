import NProgress from "nprogress";

import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";

import { Footer } from "~/components/footer";
import { NewsletterSection } from "~/components/newsletter-section";

import "../styles/nprogress.css";
import "../styles/tailwind.css";
import "../styles/integrations.css";
import "../styles/error-styles.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Karla:,400,400i,700&amp;display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="dark:bg-gray-800 text-black dark:text-white">
        <Component {...pageProps} />

        <NewsletterSection />
        <Footer />
      </div>
    </>
  );
}
