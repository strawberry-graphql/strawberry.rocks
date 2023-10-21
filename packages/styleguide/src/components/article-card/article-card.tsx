import { Caption } from "../typography/caption";
import { Heading } from "../typography/heading";
import { Label } from "../typography/label";
import { Paragraph } from "../typography/paragraph";
import clsx from "clsx";
import { format } from "date-fns";
import Link from "next/link";

const LinkIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="url(#paint0_linear_268_13469)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L19 12L12 19"
        stroke="url(#paint1_linear_268_13469)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_268_13469"
          x1="5"
          y1="13"
          x2="19"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EE0A78" />
          <stop offset="1" stopColor="#FE620A" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_268_13469"
          x1="12"
          y1="19"
          x2="19"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EE0A78" />
          <stop offset="1" stopColor="#FE620A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export type Article = {
  href: string;
  title: string;
  author: {
    name: string | null;
    login: string;
    avatar_url: string;
  };
  excerpt: string;
  date: Date;
  readingTime: string;
};

export const ArticleCard = ({
  href,
  title,
  author,
  excerpt,
  date,
  readingTime,
}: Article) => {
  return (
    <Link
      href={href}
      className={clsx(
        "bg-white bg-opacity-75 rounded-[16px] p-16 border border-g-100 flex",
        "dark:border-transparency-light dark:bg-blog-card-dark flex-col space-y-24",
        "hover:shadow-lg transition-shadow duration-200 ease-in-out"
      )}
    >
      <header className="flex items-center">
        <img
          src={author.avatar_url}
          className="w-32 h-32 aspect-square object-cover mr-12 rounded-full"
          alt={author.name || author.login}
        />

        <Paragraph className="text-g-700 dark:text-g-400">
          {author.name || author.login}
        </Paragraph>
      </header>

      <div>
        <Heading className="typography-heading-4 mb-8">{title}</Heading>
        <Paragraph variant="small" className="text-g-700 dark:text-g-400">
          {excerpt}
        </Paragraph>
      </div>

      <footer className="border-t-[1px] border-t-g-100 dark:border-t-g-900 pt-16 flex items-center">
        <Label className="text-g-700 dark:text-g-500">
          {format(date, "MMM d, yyyy")}
        </Label>
        <Caption className="uppercase ml-auto">{readingTime}</Caption>
        <LinkIcon className="inline-block ml-8" />
      </footer>
    </Link>
  );
};
