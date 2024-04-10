import { usePackageVersions } from "../hooks/use-package-versions";
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
}: {
  name: string;

  onVersionSelected?: (version: string) => void;
}) => {
  let versions = usePackageVersions(name);

  // add latest version
  versions = ["latest", ...versions];

  return null;
  // TODO: something is up with this, it kills the performance
  return (
    <div>
      <Select
        defaultValue="latest"
        onValueChange={(value) => onVersionSelected?.(value)}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Version" />
        </SelectTrigger>
        <SelectContent>
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
