import {
  Contributor,
  ContributorCard,
} from "../contributor-card/contributor-card";

export const ContributorsGrid = ({
  contributors,
}: {
  contributors: Contributor[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {contributors.map((contributor) => (
        <ContributorCard
          key={contributor.name}
          name={contributor.name}
          url={contributor.url}
          avatarUrl={contributor.avatarUrl}
          title={contributor.title}
        />
      ))}
    </div>
  );
};
