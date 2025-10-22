import { cn } from "../../../lib/cn";
import { TOCItems, TOCProvider, TOCScrollArea } from "../../ui/toc";
import ClerkTOCItems from "../../ui/toc-clerk";
import {
  type BreadcrumbProps,
  type FooterProps,
  PageBreadcrumb,
  PageFooter,
  PageLastUpdate,
  PageTOC,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverTrigger,
} from "./page-client";
import type { AnchorProviderProps } from "fumadocs-core/toc";
import { I18nLabel } from "fumadocs-ui/contexts/i18n";
import { Text } from "lucide-react";
import { type ComponentProps } from "react";

export function PageTOCTitle(props: ComponentProps<"h2">) {
  return (
    <h3
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground",
        props.className
      )}
    >
      <Text className="size-4" />
      <I18nLabel label="toc" />
    </h3>
  );
}

export function PageTOCItems({
  variant = "normal",
  ...props
}: ComponentProps<"div"> & { variant?: "clerk" | "normal" }) {
  return (
    <TOCScrollArea {...props}>
      {variant === "clerk" ? <ClerkTOCItems /> : <TOCItems />}
    </TOCScrollArea>
  );
}

export function PageTOCPopoverItems({
  variant = "normal",
  ...props
}: ComponentProps<"div"> & { variant?: "clerk" | "normal" }) {
  return (
    <TOCScrollArea {...props}>
      {variant === "clerk" ? <ClerkTOCItems /> : <TOCItems />}
    </TOCScrollArea>
  );
}

export function PageArticle(props: ComponentProps<"article">) {
  return (
    <article
      {...props}
      className={cn(
        "flex min-w-0 w-full flex-col gap-4 pt-8 px-4 md:px-6 md:mx-auto",
        props.className
      )}
    >
      {props.children}
    </article>
  );
}

export interface RootProps extends ComponentProps<"div"> {
  toc?: Omit<AnchorProviderProps, "children"> | false;
}

export function PageRoot({ toc = false, children, ...props }: RootProps) {
  const content = (
    <div
      id="nd-page"
      {...props}
      className={cn(
        "flex flex-1 w-full mx-auto max-w-(--fd-page-width) pt-(--fd-tocnav-height) pe-(--fd-toc-width)",
        props.className
      )}
    >
      {children}
    </div>
  );

  if (toc) return <TOCProvider {...toc}>{content}</TOCProvider>;
  return content;
}

export {
  PageBreadcrumb,
  PageFooter,
  PageLastUpdate,
  PageTOC,
  PageTOCPopover,
  PageTOCPopoverTrigger,
  PageTOCPopoverContent,
  type FooterProps,
  type BreadcrumbProps,
};
