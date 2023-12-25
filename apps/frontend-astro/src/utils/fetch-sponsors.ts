import { fetchOpenCollectiveSponsors } from "./fetch-opencollective-sponsors";

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

type Sponsor = {
    name: string;
    logo: string;
    href: string;
};

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

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        body: JSON.stringify({
            query,
        }),
        headers: {
            Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch sponsors");
    }

    const content = await response.json();

    if (!content.data) {
        throw new Error("No data");
    }

    return Object.keys(content.data).map((key) => {
        const sponsor = content.data[key];

        return {
            id: sponsor.login,
            name: sponsor.name,
            logo: sponsor.logo,
            href: sponsor.websiteUrl || sponsor.url,
            sponsorship: sponsor.sponsorshipsAsSponsor.nodes.find((node: any) => {
                const { sponsorable } = node;

                return sponsorable.login === "strawberry-graphql";
            }).tier,
        };
    });
};

export const fetchSponsors = async () => {
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        body: JSON.stringify({
            query: SponsorsDocument,
        }),
        headers: {
            Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
        },
    });
    const content = await response.json();

    if (!response.ok) {
        throw new Error(content.message);
    }

    if (!content.data) {
        throw new Error("No data");
    }

    const sponsors = content.data.organization.sponsors.nodes;

    const sponsorsInfo = await getGithubSponsorsInfo(sponsors);
    const openCollectiveSponsors = await fetchOpenCollectiveSponsors();

    return [...sponsorsInfo, ...openCollectiveSponsors];
}

export const fetchSponsorsForHome = async () => {
    const sponsors = await fetchSponsors();

    return sponsors.filter((sponsor) => sponsor.sponsorship.monthlyPriceInDollars >= 100);
}
