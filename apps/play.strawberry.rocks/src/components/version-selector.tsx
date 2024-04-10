import { usePackageVersions } from "../hooks/use-package-versions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const VersionSelector = ({ name }: { name: string }) => {
  let versions = usePackageVersions(name);

  // add latest version
  versions = ["latest", ...versions];

  return (
    <div>
      <Select defaultValue="latest">
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
