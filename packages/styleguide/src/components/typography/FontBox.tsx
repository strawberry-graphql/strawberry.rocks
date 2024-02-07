import clsx from "clsx";

export const FontBox = ({
  title,
  subtitle,
  link,
  font,
  fontWeight,
}: {
  title: string;
  subtitle: string;
  link: string;
  font: string;
  fontWeight?: number;
}) => {
  return (
    <div
      className={clsx("sb-unstyled flex gap-8", {
        "font-display": font === "ranade",
        "font-sans": font === "satoshi",
        "font-mono": font === "jetbrains-mono",
        "font-bold": fontWeight === 700,
        "font-medium": fontWeight === 500,
        "font-normal": fontWeight === 400,
      })}
    >
      <div className="rounded-2xl border-[1px] border-black flex justify-center items-center w-80 h-80 text-4xl">
        Aa
      </div>

      <div className="flex flex-col text-md">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <a
          href={link}
          className="mt-auto uppercase text-blue underline underline-offset-2"
        >
          link
        </a>
      </div>
    </div>
  );
};
