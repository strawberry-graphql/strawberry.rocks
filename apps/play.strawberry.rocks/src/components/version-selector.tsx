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
  defaultVersion,
}: {
  name: string;
  defaultVersion: string;
  onVersionSelected?: (version: string) => void;
}) => {
  let versions = usePackageVersions(name);

  // add latest and local versions
  versions = ["local", "latest", ...versions];

  return (
    <div>
      <Select
        defaultValue={defaultVersion}
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
