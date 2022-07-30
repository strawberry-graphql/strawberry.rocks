import sponsors from "~/data/sponsors.json";
import Image from "next/image";

export const Sponsors = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-center text-3xl font-bold">Sponsors</h2>
      <div className="grid grid-cols-4 mt-8">
        {sponsors
          .filter((sponsor) => sponsor.highlight)
          .map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center mb-8"
            >
              {sponsor.image && (
                <>
                  <span className="hidden dark:inline">
                    <Image
                      src={sponsor.image.urlDark}
                      width={sponsor.image.width}
                      height={sponsor.image.height}
                      alt={sponsor.name}
                    />
                  </span>
                  <span className="dark:hidden">
                    <Image
                      src={sponsor.image.url}
                      width={sponsor.image.width}
                      height={sponsor.image.height}
                      alt={sponsor.name}
                    />
                  </span>
                </>
              )}
              <p className="text-center text-sm">{sponsor.name}</p>
            </a>
          ))}

        <a
          href="https://opencollective.com/strawberry-graphql"
          className="flex flex-col items-center justify-center mb-8 text-xl hover:bg-slate-100 dark:hover:text-black"
        >
          Become a sponsor ✨
        </a>
      </div>
    </div>
  );
};
