import {
  Display,
  Heading,
  ContributorsGrid,
} from "@strawberry-graphql/styleguide";

import Link from "next/link";

import { fetchContributors, fetchSponsors } from "~/lib/api";

export default async function AcknowledgementsPage() {
  const contributors = await fetchContributors();
  const sponsors = await fetchSponsors();

  console.log(contributors);

  return (
    <>
      <Display>Acknowledgements</Display>
      <Heading level={4}>
        Strawberry wouldn&apos;t be possible without all these amazing people
        and sponsors, thank you!
      </Heading>

      <Heading>Sponsors</Heading>

      <ContributorsGrid
        contributors={sponsors.map((sponsor: any) => ({
          ...sponsor,
          title: "Sponsor",
        }))}
      />
      <Heading>Contributors</Heading>

      <ContributorsGrid
        contributors={contributors.map((contributor: any) => ({
          ...contributor,
          title: "Contributor",
        }))}
      />

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
    </>
  );
}

// export const getStaticProps: GetStaticProps<Props> = async () => {
//   return {
//     props: {
//       collaborators: await fetchContributors(),
//       version: await fetchLatestRelease(),
//     },
//     revalidate: 60 * 60,
//   };
// };

// export default AcknowledgementsPage;
