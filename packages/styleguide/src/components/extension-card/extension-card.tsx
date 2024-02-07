import { Tag } from "../tag/tag";
import { Heading } from "../typography/heading";
import { Paragraph } from "../typography/paragraph";
import clsx from "clsx";
import Link from "next/link";

export type Extension = {
  name: string;
  description: string;
  tags: string[];
  href: string;
};

export const ExtensionCard = ({ name, description, tags, href }: Extension) => {
  return (
    <Link
      href={href}
      className={clsx(
        "bg-white bg-opacity-75 rounded-[16px] p-16 border border-g-100 flex",
        "dark:border-transparency-light dark:bg-blog-card-dark"
      )}
    >
      <div className="flex flex-col justify-center">
        <Heading className="text-g-700 dark:text-g-500" level={4}>
          {name}
        </Heading>
        <Paragraph variant="small">{description}</Paragraph>

        <ul className="mt-4 space-x-8">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </ul>
      </div>
    </Link>
  );
};
