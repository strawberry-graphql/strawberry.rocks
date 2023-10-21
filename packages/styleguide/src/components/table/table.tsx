export const TableRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <tr className="border-b border-g-400 last:border-b-0 dark:border-g-700">
      {children}
    </tr>
  );
};

export const TableHeader = ({ children }: { children: React.ReactNode }) => {
  return <th className="pb-12 text-left">{children}</th>;
};

export const TableHead = ({ children }: { children: React.ReactNode }) => {
  return (
    <thead className="border-b border-g-400 dark:border-g-700">
      {children}
    </thead>
  );
};

export const TableCell = ({ children }: { children: React.ReactNode }) => {
  return <td className="py-12">{children}</td>;
};

export const Table = ({ children }: { children: React.ReactNode }) => {
  return <table className="w-full">{children}</table>;
};
