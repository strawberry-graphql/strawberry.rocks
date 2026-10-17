import { usePackageVersions } from "../hooks/use-package-versions";
import { LOCAL_STRAWBERRY_VERSION } from "./strawberry/strawberryVersion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";

const TRIGGER_CLASS =
  "h-6 w-auto gap-1 rounded-md border-none bg-transparent px-2 text-xs font-bold shadow-none hover:bg-muted";

const Label = () => (
  <span className="font-medium text-muted-foreground">Strawberry</span>
);

const Versions = ({
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
    <Select
      defaultValue={defaultVersion}
      onValueChange={(value) => onVersionSelected?.(value)}
    >
      <SelectTrigger aria-label="Strawberry version" className={TRIGGER_CLASS}>
        <Label />
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
  );
};

export const VersionSelector = (props: {
  name: string;
  defaultVersion: string;
  onVersionSelected?: (version: string) => void;
}) => (
  // Shows the version while the list of versions loads
  <Suspense
    fallback={
      <div className={`flex items-center ${TRIGGER_CLASS}`}>
        <Label />
        {props.defaultVersion}
      </div>
    }
  >
    <Versions {...props} />
  </Suspense>
);
