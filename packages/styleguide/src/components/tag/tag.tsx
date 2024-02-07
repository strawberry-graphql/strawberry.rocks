import { Caption } from "../typography/caption";

export const Tag = ({ children }: { children: string }) => {
  return (
    <div className="rounded-[4px] bg-g-50 px-4 py-2 inline-block dark:border-g-900 dark:bg-transparency-dark">
      <Caption className="text-pink dark:text-orange font-bold">
        {children}
      </Caption>
    </div>
  );
};
