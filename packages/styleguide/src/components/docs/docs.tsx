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
    <div className="md:grid grid-cols-[320px_1fr]">
      <div className="w-[320px] hidden md:block pl-40 pr-16 overflow-auto">
        <Spacer size={16} />
        {searchBoxTrigger}
        <Spacer size={40} />
        <SidebarNav sections={sections} />
      </div>

      <div className="max-w-[1600px] 2xl:mx-auto 2xl:relative 2xl:-left-[160px] 2lx:bg-pink md:grid grid-cols-[minmax(0,1fr)_200px]">
        {children}
      </div>
    </div>
  );
};
