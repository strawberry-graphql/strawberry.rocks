import { Fragment } from "react";

import { Link } from "./link";

type LinkProps = {
  href: string;
  title: string;
};

type Props = {
  title: string;
  spec: string;
  graphqlDocs: string;
};

const ResourceLink = ({ title, href }: LinkProps) => (
  <Link
    href={href}
    hideExternalIcon={true}
    target="_blank"
    className="p-6 border-2 border-blue-600 w-full hover:bg-gray-50 mb-6"
  >
    <div className="font-bold text-blue-600">{title}</div>
  </Link>
);

export const AdditionalResources = ({ spec, graphqlDocs, title }: Props) => {
  return (
    <Fragment>
      <h2 className="mt-8 font-bold text-2xl">Additional resources</h2>
      <div className="grid md:grid-cols-2 md:space-x-8 my-6">
        <ResourceLink href={spec} title="Read the GraphQL spec" />

        <ResourceLink href={graphqlDocs} title={`${title} on GraphQL.org`} />
      </div>
    </Fragment>
  );
};
