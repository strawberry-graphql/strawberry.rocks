import { Link } from "./link";

type EditOnGithubProps = { path: string };

export const EditOnGithub = ({ path }: EditOnGithubProps) => (
  <Link
    href={path}
    variant="box"
    className="mt-12 border-2 border-blue-600 p-4 hover:bg-gray-50 text-blue-600 flex items-center justify-center"
  >
    Edit on Github
  </Link>
);
