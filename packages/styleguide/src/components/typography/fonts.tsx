import { FontBox } from "./FontBox";

export const Fonts = () => {
  return (
    <div className="flex flex-wrap gap-24 sb-unstyled">
      <FontBox
        title="Ranade"
        subtitle="Medium - 500"
        link="https://www.fontshare.com/fonts/ranade"
        font="ranade"
        fontWeight={500}
      />
      <FontBox
        title="Satoshi"
        subtitle="Bold - 700"
        link="https://www.fontshare.com/fonts/satoshi"
        font="satoshi"
        fontWeight={700}
      />
      <FontBox
        title="Satoshi"
        subtitle="Regular - 400"
        link="https://www.fontshare.com/fonts/satoshi"
        font="satoshi"
        fontWeight={400}
      />
      <FontBox
        title="JetBrains Mono"
        subtitle="Regular - 400"
        link="https://fonts.google.com/specimen/JetBrains+Mono"
        font="jetbrains-mono"
        fontWeight={400}
      />
    </div>
  );
};
