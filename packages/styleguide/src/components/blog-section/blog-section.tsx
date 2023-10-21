import { Button } from "../button/button";
import { Caption } from "../typography/caption";
import { Display } from "../typography/display";
import { Heading } from "../typography/heading";
import { Label } from "../typography/label";
import { Paragraph } from "../typography/paragraph";

const Arrow = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19"
      stroke="url(#bg-gradient)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5L19 12L12 19"
      stroke="url(#bg-gradient)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="bg-gradient"
        x1="5"
        y1="13"
        x2="19"
        y2="13"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EE0A78" />
        <stop offset="1" stopColor="#FE620A" />
      </linearGradient>
    </defs>
  </svg>
);

export const PostCard = ({
  title,
  description,
  author,
}: {
  title: string;
  description: string;
  author: {
    name: string;
    profilePicture: string;
  };
}) => {
  return (
    <div className="h-full flex flex-col p-24 border border-g-100 rounded-[16px] bg-transparency-light dark:bg-blog-card-dark dark:border-transparency-light">
      <header className="mb-24 flex items-center">
        <img
          src={author.profilePicture}
          alt={author.name}
          className="rounded-full w-48 h-4w-48"
        />
        <Paragraph className="ml-12 text-g-700 dark:text-g-400">
          {author.name}
        </Paragraph>
      </header>

      <Heading level={4} className="mb-12">
        {title}
      </Heading>
      <Paragraph variant="small" className="dark:text-g-400 mb-24">
        {description}
      </Paragraph>

      <footer className="mt-auto pt-24 border-t border-g-100 dark:border-g-900 flex justify-between">
        <Label className="text-g-700 dark:text-g-500">Dec 12, 2023</Label>

        <div className="flex items-center">
          <Caption className="text-g-700 dark:text-g-500 uppercase mr-8">
            30 minutes reading
          </Caption>

          <Arrow />
        </div>
      </footer>
    </div>
  );
};

const BlogItem = ({
  title,
  description,
  author,
}: {
  title: string;
  description: string;
  author: {
    name: string;
    profilePicture: string;
  };
}) => {
  return (
    <li className="mb-24 w-full">
      <PostCard title={title} description={description} author={author} />
    </li>
  );
};

export const BlogSection = () => {
  return (
    <section className="text-center">
      <div className="px-24">
        <Heading className="mb-24">Updates from the team?</Heading>

        <Button as="a" href="/blog">
          View all
        </Button>
      </div>

      <ul className="mt-80 gap-24 text-left grid auto-rows-auto md:grid-cols-2 items-stretch px-24 max-w-screen-lg mx-auto">
        <BlogItem
          title="Type hints"
          description="Type hints are a great way to document your code and make it easier to understand. Theyter autocompletion and error detection."
          author={{
            name: "Patrick",
            profilePicture:
              "https://avatars.githubusercontent.com/u/12762442?v=4",
          }}
        />

        <BlogItem
          title="Type hints"
          description="Type hints are a great way to document your code."
          author={{
            name: "Patrick",
            profilePicture:
              "https://avatars.githubusercontent.com/u/12762442?v=4",
          }}
        />

        <BlogItem
          title="Type hints"
          description="Type hints are a great way to document your code and make it easier to understand. They also help your IDE to provide better autocompletion and error detection."
          author={{
            name: "Patrick",
            profilePicture:
              "https://avatars.githubusercontent.com/u/12762442?v=4",
          }}
        />

        <BlogItem
          title="Type hints"
          description="Type hints are a great way to document your code and mako provide better autocompletion and error detection."
          author={{
            name: "Patrick",
            profilePicture:
              "https://avatars.githubusercontent.com/u/12762442?v=4",
          }}
        />

        <BlogItem
          title="Type hints"
          description="Type hints are a great way to document your code and make it easier to understand. They also help your IDE to provide better autocompletion and error detection."
          author={{
            name: "Patrick",
            profilePicture:
              "https://avatars.githubusercontent.com/u/12762442?v=4",
          }}
        />

        <BlogItem
          title="Type hints"
          description="Type hints are a great way to document your code and make it easier to understand. They autocompletion and error detection."
          author={{
            name: "Patrick",
            profilePicture:
              "https://avatars.githubusercontent.com/u/12762442?v=4",
          }}
        />

        <BlogItem
          title="Type hints"
          description="Type hints are a great way to document your code and make it easier to understand. They also help your IDE to provide better autocompletion and error detection."
          author={{
            name: "Patrick",
            profilePicture:
              "https://avatars.githubusercontent.com/u/12762442?v=4",
          }}
        />
      </ul>
    </section>
  );
};
