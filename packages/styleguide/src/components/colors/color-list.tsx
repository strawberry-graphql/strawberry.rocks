import { colors } from "../../../tailwind.config";
import clsx from "clsx";

type Color = {
  hex: string;
  name: string;
  key: string;
};

const Title = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="font-sans font-bold mt-4">{children}</h2>;
};
const Subtitle = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-g-700">{children}</p>;
};

const Box = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="sb-unstyled">
      {children}
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </div>
  );
};

const ColorBox = ({ color }: { color: Color }) => {
  return (
    <Box title={color.name} subtitle={color.hex}>
      <div
        className={clsx("w-80 h-80 rounded-md", {
          "bg-strawberry": color.key === "strawberry",
          "bg-yellow": color.key === "yellow",
          "bg-yellow-light": color.key === "yellow-light",
          "bg-green": color.key === "green",
          "bg-pink": color.key === "pink",
          "bg-blue": color.key === "blue",
          "bg-magenta": color.key === "magenta",
          "bg-orange": color.key === "orange",

          "bg-black": color.key === "black",
          "bg-g-900": color.key === "g-900",
          "bg-g-700": color.key === "g-700",
          "bg-g-500": color.key === "g-500",
          "bg-g-400": color.key === "g-400",
          "bg-g-100": color.key === "g-100",
          "bg-g-50": color.key === "g-50",
          "bg-white": color.key === "white",
          "border-g-900 border-[1px]": color.key === "white",

          "bg-code-green": color.key === "code-green",
          "bg-code-blue": color.key === "code-blue",
          "bg-code-purple": color.key === "code-purple",
          "bg-code-pink": color.key === "code-pink",
          "bg-code-orange": color.key === "code-orange",
        })}
      />
    </Box>
  );
};

const List = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-row flex-wrap gap-16">
      {/* @ts-ignore */}
      {colors[name].map((color: Color) => (
        <ColorBox color={color} key={color.hex} />
      ))}
    </div>
  );
};

export const AccentColorList = () => {
  return <List name="accent" />;
};

export const GreyScaleColorList = () => {
  return <List name="greyscale" />;
};

export const CodeColorList = () => {
  return <List name="code" />;
};

export const Gradient = () => {
  const magenta = colors.accent.find(
    (color: Color) => color.key === "magenta"
  )!;
  const orange = colors.accent.find((color: Color) => color.key === "orange")!;

  return (
    <div className="sb-unstyled flex gap-16 flex-wrap">
      <div className="w-[224px]">
        <div className="w-full h-80 rounded-md bg-gradient-to-r from-magenta to-orange" />
        <div className="flex flex-row justify-between">
          <div>
            <Title>{magenta.name}</Title>
            <Subtitle>{magenta.hex}</Subtitle>
          </div>
          <div>
            <Title>{orange.name}</Title>
            <Subtitle>{orange.hex}</Subtitle>
          </div>
        </div>
      </div>
      <div className="w-[224px]">
        <div className="w-full h-80 rounded-md bg-gradient-to-r from-orange to-magenta" />
        <div className="flex flex-row justify-between">
          <div>
            <Title>{orange.name}</Title>
            <Subtitle>{orange.hex}</Subtitle>
          </div>
          <div>
            <Title>{magenta.name}</Title>
            <Subtitle>{magenta.hex}</Subtitle>
          </div>
        </div>
      </div>
    </div>
  );
};
