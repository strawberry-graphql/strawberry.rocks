import { Caption } from "../typography/caption";
import { Paragraph } from "../typography/paragraph";
import clsx from "clsx";

const LinkIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#F0F1F1" />
      <path
        d="M16 12.6667V16.6667C16 17.0203 15.8595 17.3594 15.6095 17.6095C15.3594 17.8595 15.0203 18 14.6667 18H7.33333C6.97971 18 6.64057 17.8595 6.39052 17.6095C6.14048 17.3594 6 17.0203 6 16.6667V9.33333C6 8.97971 6.14048 8.64057 6.39052 8.39052C6.64057 8.14048 6.97971 8 7.33333 8H11.3333"
        stroke="#0D0E12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 6H18V10"
        stroke="#0D0E12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 13.3333L18 6"
        stroke="#0D0E12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export type Contributor = {
  name: string;
  url: string;
  avatarUrl: string;
  title: string;
};

export const ContributorCard = ({
  name,
  url,
  avatarUrl,
  title,
}: Contributor) => {
  return (
    <div
      className={clsx(
        "bg-white bg-opacity-75 rounded-[16px] p-16 border border-g-100 flex",
        "dark:border-transparency-light dark:bg-blog-card-dark"
      )}
    >
      <img
        src={avatarUrl}
        className="w-[74px] h-[74px] rounded-[12px] aspect-square object-cover mr-24"
      />
      <div className="flex flex-col justify-center">
        <Caption className="text-g-700 dark:text-g-500">{title}</Caption>
        <Paragraph variant="small" className="font-bold">
          {name}
        </Paragraph>
      </div>

      <a href={url} className="ml-auto" target="_blank" rel="noreferrer">
        <LinkIcon />
      </a>
    </div>
  );
};
