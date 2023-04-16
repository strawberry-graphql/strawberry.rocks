const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query ContributionsQuery($from: DateTime) {
    collective(slug: "strawberry-graphql") {
      transactions(dateFrom: $from, kind: CONTRIBUTION) {
        nodes {
          kind
          createdAt
          fromAccount {
            name
            imageUrl
            website
          }
          amount {
            value
          }
        }
      }
    }
  }
`;

type Result = {
  data: {
    collective: {
      transactions: {
        nodes: {
          kind: string;
          createdAt: string;
          fromAccount: {
            name: string;
            imageUrl: string;
            website: string;
          };
          amount: {
            value: number;
          };
        }[];
      };
    };
  };
};

type Sponsor = {
  login: string;
  name: string;
  logo: string;
  href: string;
  sponsorship: {
    monthlyPriceInDollars: number;
  };
};

export async function getOpenCollectiveSponsors(): Promise<Sponsor[]> {
  console.log("Fetching Open Collective sponsors...");

  const from = new Date();
  from.setMonth(from.getMonth() - 1);

  const fromString = from.toISOString();

  const result = await fetch("https://api.opencollective.com/graphql/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { from: fromString },
    }),
  }).then((res) => res.json());

  const { data } = result as Result;

  const sponsors = data.collective.transactions.nodes.map((node) => {
    const { name, imageUrl, website } = node.fromAccount;

    return {
      login: name,
      name,
      logo: imageUrl,
      href: website,
      sponsorship: {
        monthlyPriceInDollars: node.amount.value,
      },
    };
  });

  return sponsors;
}
