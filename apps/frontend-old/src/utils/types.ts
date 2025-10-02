export type Sponsor = {
  id: string;
  name: string;
  logo: string;
  href: string;
  sponsorship: {
    monthlyPriceInDollars: number;
  };
};
