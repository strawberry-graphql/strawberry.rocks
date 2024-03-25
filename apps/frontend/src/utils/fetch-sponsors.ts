import { fetchOpenCollectiveSponsors } from "./fetch-opencollective-sponsors";
import { fetchPolarSponsors } from "./fetch-polar-sponsors";
import { githubFetch } from "./github-fetch";
import type { Sponsor } from "./types";

const SponsorsDocument = `
  query sponsors {
    organization(login: "strawberry-graphql") {
      sponsors(first: 100) {
        nodes {
          __typename
          ... on User {
            login
            name
            avatarUrl
          }
          ... on Organization {
            login
            name
            avatarUrl
          }
        }
      }
    }
  }
`;

const getSponsorInfoQuery = (
  alias: string,
  typename: string,
  login: string,
) => {
  const rootField = typename === "User" ? "user" : "organization";

  // TODO: don't judge me for this
  return `${alias}: ${rootField}(login: "${login}") {
      login
      name
      logo: avatarUrl
      websiteUrl
      url
      ... on Sponsorable {
        sponsorshipsAsSponsor(first: 100) {
          nodes {
            sponsorable {
              __typename
              ... on Organization {
                login
              }
              ... on User {
                login
              }
            }
            tier {
              name
              monthlyPriceInDollars
            }
          }
        }
      }
    }`;
};

const getGithubSponsorsInfo = async (sponsors: any) => {
  const queries = sponsors!.map((sponsor: any, index: number) => {
    const { __typename, login } = sponsor;

    return getSponsorInfoQuery(`sponsor${index}`, __typename, login);
  });

  const query = `query {
    ${queries.join("\n")}
    }`;

  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query,
    }),
  });

  const content = await response.json();

  if (!content.data) {
    throw new Error("No data");
  }

  return Object.keys(content.data).map((key) => {
    const sponsor = content.data[key];

    return {
      id: sponsor.login,
      name: sponsor.name || sponsor.login,
      logo: sponsor.logo,
      href: sponsor.websiteUrl || sponsor.url,
      sponsorship: sponsor.sponsorshipsAsSponsor.nodes.find((node: any) => {
        const { sponsorable } = node;

        return sponsorable.login === "strawberry-graphql";
      }).tier,
    } as Sponsor;
  });
};

export const fetchSponsors = async () => {
  const response = await githubFetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: SponsorsDocument,
    }),
  });
  const content = await response.json();

  const sponsors = content.data.organization.sponsors.nodes;

  const sponsorsInfo = await getGithubSponsorsInfo(sponsors);
  const openCollectiveSponsors = await fetchOpenCollectiveSponsors();
  const polarSponsors = await fetchPolarSponsors();

  return [...sponsorsInfo, ...openCollectiveSponsors, ...polarSponsors].sort(
    (a, b) => {
      return (
        b.sponsorship.monthlyPriceInDollars -
        a.sponsorship.monthlyPriceInDollars
      );
    },
  );
};

export const fetchSponsorsForHome = async () => {
  const sponsors = await fetchSponsors();

  return sponsors.filter(
    (sponsor) => sponsor.sponsorship.monthlyPriceInDollars >= 100,
  );
};
