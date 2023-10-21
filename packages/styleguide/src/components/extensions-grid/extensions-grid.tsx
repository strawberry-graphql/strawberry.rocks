import { Extension, ExtensionCard } from "../extension-card/extension-card";

export const ExtensionsGrid = ({ extensions }: { extensions: Extension[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
      {extensions.map((extension) => (
        <ExtensionCard
          key={extension.name}
          name={extension.name}
          description={extension.description}
          href={extension.href}
          tags={extension.tags}
        />
      ))}
    </div>
  );
};
