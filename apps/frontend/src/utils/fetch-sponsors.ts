import sponsorsData from "../data/sponsors.json";

type Sponsor = {
  id: string;
  name: string;
  logo: string;
  href: string | null;
  sponsorship: {
    monthlyPriceInDollars: number;
  };
};

export const fetchSponsors = async (): Promise<Sponsor[]> => {
  return sponsorsData.all;
};

export const fetchSponsorsForHome = async (): Promise<Sponsor[]> => {
  return sponsorsData.home;
};
