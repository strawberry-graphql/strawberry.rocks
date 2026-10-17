import { usePackageVersions } from "../hooks/use-package-versions";
import { LOCAL_STRAWBERRY_VERSION } from "./strawberry/strawberryVersion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const VersionSelector = ({
  name,
  onVersionSelected,
  defaultVersion,
}: {
  name: string;
  defaultVersion: string;
  onVersionSelected?: (version: string) => void;
}) => {
  let versions = usePackageVersions(name);

  // add latest version, and the local checkout when the dev server has one
  versions = [
    ...(__LOCAL_STRAWBERRY__ ? [LOCAL_STRAWBERRY_VERSION] : []),
    "latest",
    ...versions,
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-muted-foreground lg:inline">
        strawberry-graphql
      </span>
      <Select
        defaultValue={defaultVersion}
        onValueChange={(value) => onVersionSelected?.(value)}
      >
        <SelectTrigger
          aria-label="Strawberry version"
          className="h-8 w-auto gap-2 bg-background font-medium"
        >
          <SelectValue placeholder="Version" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {versions.map((version) => (
            <SelectItem key={version} value={version}>
              {version}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
