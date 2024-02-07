const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query ContributionsQuery($from: DateTime) {
    collective(slug: "strawberry-graphql") {
      transactions(dateFrom: $from, kind: CONTRIBUTION) {
        nodes {
          kind
          createdAt
          fromAccount {
            name
            slug
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
            slug: string;
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
  id: string;
  name: string;
  logo: string;
  href: string;
  sponsorship: {
    monthlyPriceInDollars: number;
  };
};

export async function fetchOpenCollectiveSponsors(): Promise<Sponsor[]> {
  const from = new Date();
  from.setMonth(from.getMonth() - 1);

  const fromString = from.toISOString();
  const url = new URL("https://api.opencollective.com/graphql/v2");
  url.searchParams.append("personalToken", import.meta.env.OPENCOLLECTIVE_TOKEN!);

  const result = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { from: fromString },
    }),
  }).then((res) => res.json());

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  const { data } = result as Result;

  const sponsors = data.collective.transactions.nodes.map((node) => {
    const { name, slug, imageUrl, website } = node.fromAccount;

    return {
      id: slug,
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
