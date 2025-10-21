import {
  PencilIcon,
  ThunderIcon,
  LoadingIcon,
  LinkIcon,
  GenericsIcon,
  HeartIcon,
  IntegrationsIcon,
  MoveIcon,
} from "../icons";
import "./feature-card.css";

type IconType =
  | "pencil"
  | "thunder"
  | "loading"
  | "link"
  | "generics"
  | "heart"
  | "integrations"
  | "move";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconType;
}

const iconMap = {
  pencil: PencilIcon,
  thunder: ThunderIcon,
  loading: LoadingIcon,
  link: LinkIcon,
  generics: GenericsIcon,
  move: MoveIcon,
  heart: HeartIcon,
  integrations: IntegrationsIcon,
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="feature-card">
      <div className="icon">
        <Icon />
      </div>
      <div>
        <p className="title typography-paragraph">{title}</p>
        <p className="description typography-paragraph-2">{description}</p>
      </div>
    </div>
  );
}
