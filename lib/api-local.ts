export const fetchDocPageLocal = async ({
  prefix,
  filename,
}: {
  prefix: string;
  filename: string;
  owner?: string;
  repo?: string;
  ref?: string;
}) => {
  const pageText = "";

  return {
    page: pageText,
  };
};
