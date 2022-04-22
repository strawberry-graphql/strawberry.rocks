import { GetStaticProps, NextPage } from "next";

import { Header } from "~/components/header";
import { Link } from "~/components/link";
import { SEO } from "~/components/seo";
import { fetchContributors, fetchLatestRelease } from "~/lib/api";
import { GithubCollaborator } from "~/types/api";
import sponsors from "~/data/sponsors.json";

const SponsorLink = ({
  children,
  link,
}: {
  link: string;
  children: React.ReactNode;
}) => {
  if (!link.startsWith("http")) {
    link = `http://${link}`;
  }

  return (
    <Link href={link} target="_blank">
      {children}
    </Link>
  );
};

type Props = {
  collaborators: GithubCollaborator[];
  version?: string;
};

const AcknowledgementsPage: NextPage<Props> = ({ collaborators, version }) => {
  return (
    <>
      <SEO title="Acknowledgements" />

      <Header version={version} />

      <div className="mx-auto w-full max-w-7xl p-8 pb-12">
        <h1 className="text-4xl md:text-5xl mb-4">Acknowledgements</h1>
        <p className="mb-8">We&apos;d like to thank all of our sponsors:</p>
        <ul className="flex mb-6 flex-wrap">
          {sponsors.map((sponsor, index) => (
            <li key={index} className="w-56 mb-4 list-disc">
              <SponsorLink link={sponsor.url}>{sponsor.name}</SponsorLink>
            </li>
          ))}
        </ul>
        <p className="mb-8">And all of our contributors:</p>

        <ul className="flex mb-6 flex-wrap">
          {collaborators.map((member, index) => (
            <li key={index} className="w-56 mb-4 list-disc">
              <SponsorLink
                link={member.url || `https://github.com/${member.login}`}
              >
                {member.name ?? member.login}
              </SponsorLink>
            </li>
          ))}
        </ul>

        <div>
          <p className="my-8">
            In addition we&apos;d like to thank also the following people:
          </p>
          <ul>
            <li>
              <Link href="https://twitter.com/druguinni" underline>
                Orlando Festa
              </Link>{" "}
              for the fantastic work on the Strawberry logo.
            </li>

            <li>
              <Link href="https://twitter.com/BijlsmaLotte" underline>
                Lotte Bijlsma
              </Link>{" "}
              for the amazing design of this website.
            </li>
          </ul>

          <h2 className="mt-8 mb-4 text-3xl">Icons:</h2>
          <p className="mb-6">
            We are using icons from{" "}
            <Link href="https://thenounproject.com" underline>
              The Noun Project
            </Link>
            . Here&apos;s the list of icons we used on this website:
          </p>

          <ul>
            <li>
              Async by{" "}
              <Link href="https://thenounproject.com/t.rostilov/" underline>
                Timofey Rostilov
              </Link>
            </li>
            <li>
              Server by{" "}
              <Link href="https://thenounproject.com/clea.doltz/" underline>
                Clea Doltz
              </Link>
            </li>
            <li>
              Python by{" "}
              <Link href="https://thenounproject.com/priyokumoro5/" underline>
                Zaenal Abidin
              </Link>
            </li>
            <li>
              Boxes by{" "}
              <Link href="https://thenounproject.com/iconsbazaar89/" underline>
                Icons Bazaar
              </Link>
            </li>
            <li>
              Navigation by{" "}
              <Link href="https://thenounproject.com/Flatart/" underline>
                Flatart
              </Link>
            </li>
            <li>
              Close by{" "}
              <Link href="https://thenounproject.com/landan/" underline>
                Landan Lloyd
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      collaborators: await fetchContributors(),
      version: await fetchLatestRelease(),
    },
    revalidate: 60 * 60,
  };
};

export default AcknowledgementsPage;
