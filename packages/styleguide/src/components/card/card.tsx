import { Paragraph } from "../typography/paragraph";
import {
  Zap,
  Edit2,
  Move,
  Heart,
  Link,
  Layers,
  Loader,
  Radio,
} from "react-feather";

export type Icons =
  | "edit"
  | "zap"
  | "move"
  | "heart"
  | "layers"
  | "link"
  | "loader"
  | "radio";

const CardIcon = ({ icon }: { icon: Icons }) => {
  const iconMap = {
    edit: Edit2,
    move: Move,
    heart: Heart,
    link: Link,
    zap: Zap,
    layers: Layers,
    loader: Loader,
    radio: Radio,
  };

  const Icon = iconMap[icon] || null;

  return (
    <div className="bg-strawberry rounded-[4px] w-40 h-40 justify-center items-center flex">
      <Icon className="stroke-white" />
    </div>
  );
};

export const Card = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: Icons;
}) => {
  return (
    <div className="p-24 border border-g-100 rounded-[16px] bg-transparency-light dark:bg-transparency-dark dark:border-transparency-light">
      <div className="mb-24">
        <CardIcon icon={icon} />
      </div>

      <Paragraph bold className="mb-8">
        {title}
      </Paragraph>
      <Paragraph variant="small">{description}</Paragraph>
    </div>
  );
};
