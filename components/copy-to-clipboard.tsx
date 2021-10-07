import { DuplicateIcon, CheckCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

export const CopyToClipboard = ({ getText }: { getText: () => string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCopied(false), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);
  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(getText());
  };

  return (
    <button onClick={handleCopy} className="bg-white p-2 border-2">
      {copied ? (
        <span className="text-green-500 flex">
          Copied
          <CheckCircleIcon className="ml-2 h-6 w-6" />
        </span>
      ) : (
        <DuplicateIcon className="h-6 w-6 text-gray-800" />
      )}
    </button>
  );
};
