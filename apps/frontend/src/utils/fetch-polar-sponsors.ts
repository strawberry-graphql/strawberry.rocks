import type { Sponsor } from "./types";

export const fetchPolarSponsors = async () => {
  // temporarily hard coded

  return [
    {
      id: "stellate",
      name: "Stellate",
      logo: "this is overriden",
      href: "https://stellate.co",
      sponsorship: {
        monthlyPriceInDollars: 500,
      },
    },
  ] as Sponsor[];
};
