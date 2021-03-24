import { Link } from "./link";

type EditOnGithubProps = { path: string };

export const EditOnGithub = ({ path }: EditOnGithubProps) => (
  <Link
    href={path}
    className="mt-12 border-2 border-blue-600 p-4 hover:bg-gray-50 text-blue-600 flex items-center justify-center dark:border-blue-300 dark:text-blue-300 dark:hover:bg-blue-900"
  >
    Edit on Github
  </Link>
);
