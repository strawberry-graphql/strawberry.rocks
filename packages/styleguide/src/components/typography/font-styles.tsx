import { fonts, typography } from "../../../tailwind.config";
import { Caption } from "./caption";
import { Code } from "./code";
import { Display } from "./display";
import { Heading } from "./heading";
import { Label } from "./label";
import { Paragraph } from "./paragraph";
import React from "react";

export const Grid = ({
  children,
  rows = 1,
  columns = 2,
}: {
  children: React.ReactNode;
  rows?: number;
  columns?: number;
}) => {
  return (
    <div
      className="grid gap-12 items-baseline sb-unstyled"
      style={{
        gridTemplateRows: `repeat(${rows}, auto)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
};

const Style = ({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) => {
  return (
    <div className="sb-unstyled">
      {children}
      <Caption className="mt-4 uppercase text-g-700 font-bold">
        {caption}
      </Caption>
    </div>
  );
};

const getCaption = (config: {
  font: string;
  size: string;
  weight: string;
  lineHeight: string;
}) => {
  // @ts-ignore
  const fontName = fonts[config.font];
  const size = config.size.replace("px", "");
  const lineHeight = config.lineHeight.replace("px", "");
  const weight = {
    400: "Regular",
    500: "Medium",
    700: "Bold",
  }[config.weight];

  return `${fontName} ${weight} ${size}/${lineHeight}`;
};

export const DisplayStyle = () => {
  const fontStyle = typography.display[0];

  return (
    <Style caption={getCaption(fontStyle)}>
      <Display>{fontStyle.name}</Display>
    </Style>
  );
};

export const Headings = () => {
  return (
    <Grid rows={typography.heading.length / 2}>
      {typography.heading.map((fontStyle, index) => (
        <Style caption={getCaption(fontStyle)} key={fontStyle.name}>
          {/* @ts-ignore */}
          <Heading level={index + 1}>{fontStyle.name}</Heading>
        </Style>
      ))}
    </Grid>
  );
};

export const HeadingsWithLinks = () => {
  return (
    <Grid rows={typography.heading.length / 2}>
      {typography.heading.map((fontStyle, index) => (
        <Style caption={getCaption(fontStyle)} key={fontStyle.name}>
          {/* @ts-ignore */}
          <Heading level={index + 1}>
            <a href="#example">{fontStyle.name}</a>
          </Heading>
        </Style>
      ))}
    </Grid>
  );
};

export const Paragraphs = () => {
  return (
    <Grid rows={typography.paragraph.length}>
      {typography.paragraph.map((fontStyle, index) => (
        <>
          <Style caption={getCaption(fontStyle)} key={fontStyle.name}>
            <Paragraph variant={index == 1 ? "small" : undefined}>
              {fontStyle.name}
            </Paragraph>
          </Style>

          <Style
            caption={getCaption({ ...fontStyle, weight: "700" })}
            key={fontStyle.name}
          >
            <Paragraph variant={index == 1 ? "small" : undefined}>
              <strong>{fontStyle.name}</strong>
            </Paragraph>
          </Style>
        </>
      ))}
    </Grid>
  );
};

export const Others = () => {
  const codeStyle = typography.code[0];

  return (
    <Grid rows={1} columns={4}>
      <Style caption={getCaption(codeStyle)} key={codeStyle.name}>
        <Code>{codeStyle.name}</Code>
      </Style>

      {typography.caption.map((fontStyle) => (
        <Style caption={getCaption(fontStyle)} key={fontStyle.name}>
          <Caption>{fontStyle.name}</Caption>
        </Style>
      ))}

      {typography.label.map((fontStyle, index) => (
        <Style caption={getCaption(fontStyle)} key={fontStyle.name}>
          <Label variant={index == 1 ? "small" : undefined}>
            {fontStyle.name}
          </Label>
        </Style>
      ))}
    </Grid>
  );
};
