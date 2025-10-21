import { FeatureCard } from "./feature-card";
import "./features.css";

const features = [
  {
    title: "Type hints",
    description:
      "Strawberry leverages Python type hints to provide a great developer experience while creating GraphQL Libraries.",
    icon: "pencil",
  },
  {
    title: "Async Support",
    description:
      "Strawberry supports async/await out of the box, allowing you to write your resolvers in a non-blocking way.",
    icon: "thunder",
  },
  {
    title: "Extensible",
    description:
      "Strawberry has support for schema and field extensions, allowing you to extend the schema with custom logic.",
    icon: "move",
  },
  {
    title: "Community",
    description:
      "Strawberry is backed by a great community, with a lot of people willing to help you out.",
    icon: "heart",
  },
  {
    title: "Generics",
    description:
      "Strawberry supports generics, allowing you to create reusable types that can be used in multiple places.",
    icon: "generics",
  },
  {
    title: "Federation",
    description:
      "Strawberry supports Federation, allowing you to create a federated GraphQL schema.",
    icon: "link",
  },
  {
    title: "Dataloaders",
    description:
      "Strawberry comes with support for dataloaders, allowing you to batch multiple queries into a single one.",
    icon: "loading",
  },
  {
    title: "Integrations",
    description:
      "Strawberry has support for multiple integrations, allowing you to use it with your favorite web framework.",
    icon: "integrations",
  },
] as const;

export function Features() {
  return (
    <div className="features-section full">
      <h1>Modern Python, modern features</h1>
      <div className="features-container">
        <ul>
          {features.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
