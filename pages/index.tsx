import { GetStaticProps, NextPage } from "next";

import { Features } from "~/components/features";
import { Header } from "~/components/header";
import { Hero } from "~/components/hero";
import { FlashIcon } from "~/components/icons/flash";
import { Link } from "~/components/link";
import { SEO } from "~/components/seo";
import { fetchLatestRelease } from "~/lib/api";

type Props = {
  version?: string;
};

const HomePage: NextPage<Props> = ({ version }) => (
  <>
    <SEO title="A Python library for GraphQL" />
    <Header version={version} />
    <Hero />

    <div className="flex-1 my-10 mx-auto max-w-5xl text-center">
      <p className="mt-12 mb-6 font-bold text-xl">
        Learn how to create GraphQL API using Strawberry
      </p>
      <Link href="/docs/" className="text-red-500 text-lg" underline>
        View documentation 📝
      </Link>
      <Features />
      <div className="flex px-8 mt-32 my-24 text-left space-x-10">
        <div className="w-96 text-xl font-bold">
          Create GraphQL APIs in no time
        </div>

        <div>
          <p className="mb-4">
            Strawberry&apos;s friendly API allows to create GraphQL API rather
            quickly, the debug server makes it easy to quickly test and debug.
          </p>
          <p>
            <strong>Django</strong> and <strong>ASGI</strong> support allow to
            have your API deployed in production in matter of minutes
          </p>
        </div>
        <div className="hidden md:block">
          <FlashIcon className="w-24 h-40" />
        </div>
      </div>
    </div>
  </>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  return { props: { version: await fetchLatestRelease() }, revalidate: 60 };
};

export default HomePage;
