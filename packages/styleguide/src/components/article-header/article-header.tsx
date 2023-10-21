import { Heading } from "../typography/heading";
import { format } from "date-fns";

export const ArticleHeader = ({
  author,
  title,
  duration,
  date,
}: {
  author: {
    name: string | null;
    login: string;
    avatar_url: string;
  };
  title: string;
  duration: string;
  date: Date;
}) => {
  return (
    <header className="space-y-48">
      <div className="flex space-x-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar_url}
          className="w-64 h-64 rounded-full"
          alt={author.name || author.login}
        />

        <div className="relative flex-1">
          <h2 className="typography-heading-4">
            {author.name || author.login}
          </h2>

          <div className="flex space-x-8 items-center md:space-x-0">
            <div className="typography-label-2 md:absolute top-0 right-0">
              {format(date, "dd MMMM yyyy")}
            </div>
            <div className="w-4 h-4 rounded-full bg-black dark:bg-white md:hidden"></div>
            <div className="typography-caption uppercase">{duration}</div>
          </div>
        </div>
      </div>

      <Heading>{title}</Heading>
    </header>
  );
};
