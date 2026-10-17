import { EXAMPLES, type Example } from "../examples";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, LibraryBig } from "lucide-react";

export const ExamplesMenu = ({
  onSelect,
}: {
  onSelect: (example: Example) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="px-2 text-foreground sm:px-3"
        aria-label="Examples"
      >
        <LibraryBig className="sm:hidden" />
        <span className="hidden sm:inline">Examples</span>
        <ChevronDown className="-mr-1 hidden opacity-50 sm:block" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-72">
      <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
        Start from an example
      </DropdownMenuLabel>
      {EXAMPLES.map((example) => (
        <DropdownMenuItem
          key={example.slug}
          onSelect={() => onSelect(example)}
          className="flex-col items-start gap-0.5"
        >
          <span className="font-bold">{example.title}</span>
          <span className="text-xs text-muted-foreground">
            {example.description}
          </span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
