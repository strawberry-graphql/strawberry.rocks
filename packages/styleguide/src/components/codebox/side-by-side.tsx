export const SideBySide = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col sm:grid grid-cols-2 gap-24">{children}</div>
  );
};
