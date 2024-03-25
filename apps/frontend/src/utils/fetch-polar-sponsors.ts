import type { Sponsor } from "./types";

export const fetchPolarSponsors = async () => {
  // temporarily hard coded

  return [
    {
      id: "stellate",
      name: "Stellate",
      logo: "this is overriden",
      href: "https://stellate.co/?utm_source=sponsor&utm_medium=strawberry",
      sponsorship: {
        monthlyPriceInDollars: 500,
      },
    },
  ] as Sponsor[];
};
