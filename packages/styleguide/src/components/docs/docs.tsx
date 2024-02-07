import { Section, SidebarNav } from "../sidebar-nav/sidebar-nav";
import { Spacer } from "../spacer/spacer";

export const DocsContent = ({ children }: { children: React.ReactNode }) => (
  // We use #docs-content on algolia to find content
  <div className="docs-content" id="docs-content">
    {children}
  </div>
);

export const DocsWrapper = ({
  sections,
  children,
  searchBoxTrigger,
}: {
  sections: Section[];
  children: React.ReactNode;
  searchBoxTrigger: React.ReactNode;
}) => {
  return (
    <div className="md:grid grid-cols-[320px_1fr] max-w-[1600px] mx-auto">
      <div className="w-[320px] hidden md:block pl-40 pr-16 overflow-auto">
        <Spacer size={16} />
        {searchBoxTrigger}
        <Spacer size={40} />
        <SidebarNav sections={sections} />
      </div>

      <div className="lg:grid grid-cols-[minmax(0,1fr)_250px]">{children}</div>
    </div>
  );
};
