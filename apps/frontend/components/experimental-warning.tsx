import { Link } from "./link";

export const ExperimentalWarning = () => (
  <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-red-500 p-6 my-6">
    <div className="font-bold mb-2">Caution:</div>

    <p className="mb-4">
      This documentation refers to an experimental feature of Strawberry, these
      features may change significantly and without a warning before they become
      a part of the main strawberry API.
    </p>

    <p>
      This documentation is aimed at early adopters and people who are curious.
      If you&apos;re interested in contributing to this feature{" "}
      <Link
        href="https://github.com/strawberry-graphql/strawberry/discussions"
        underline
      >
        join the discussion on our GitHub page
      </Link>
      .
    </p>
  </div>
);
