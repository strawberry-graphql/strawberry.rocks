import clsx from "clsx";

const NoteIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.166 8.49993C20.3849 8.28106 20.6447 8.10744 20.9307 7.98899C21.2167 7.87054 21.5232 7.80957 21.8327 7.80957C22.1422 7.80957 22.4487 7.87054 22.7347 7.98899C23.0206 8.10744 23.2805 8.28106 23.4993 8.49993C23.7182 8.7188 23.8918 8.97863 24.0103 9.2646C24.1287 9.55057 24.1897 9.85706 24.1897 10.1666C24.1897 10.4761 24.1287 10.7826 24.0103 11.0686C23.8918 11.3546 23.7182 11.6144 23.4993 11.8333L12.2493 23.0833L7.66602 24.3333L8.91602 19.7499L20.166 8.49993Z"
      stroke="#AED5FB"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="1"
      y="1"
      width="30"
      height="30"
      rx="15"
      stroke="#AED5FB"
      strokeWidth="2"
    />
  </svg>
);

const TipIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.9993 7.66675L18.5743 12.8834L24.3327 13.7251L20.166 17.7834L21.1493 23.5167L15.9993 20.8084L10.8493 23.5167L11.8327 17.7834L7.66602 13.7251L13.4243 12.8834L15.9993 7.66675Z"
      stroke="#8ED287"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="1"
      y="1"
      width="30"
      height="30"
      rx="15"
      stroke="#8ED287"
      strokeWidth="2"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5747 9.21659L7.51632 20.9999C7.37079 21.2519 7.29379 21.5377 7.29298 21.8287C7.29216 22.1197 7.36756 22.4059 7.51167 22.6587C7.65579 22.9115 7.86359 23.1222 8.11441 23.2698C8.36523 23.4174 8.65032 23.4967 8.94132 23.4999H23.058C23.349 23.4967 23.6341 23.4174 23.8849 23.2698C24.1357 23.1222 24.3435 22.9115 24.4876 22.6587C24.6317 22.4059 24.7071 22.1197 24.7063 21.8287C24.7055 21.5377 24.6285 21.2519 24.483 20.9999L17.4247 9.21659C17.2761 8.97168 17.0669 8.76919 16.8173 8.62866C16.5677 8.48813 16.2861 8.41431 15.9997 8.41431C15.7132 8.41431 15.4316 8.48813 15.182 8.62866C14.9324 8.76919 14.7232 8.97168 14.5747 9.21659Z"
      stroke="#EAAD75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13.5V16.8333"
      stroke="#EAAD75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 20.1667H16.0083"
      stroke="#EAAD75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="1"
      y="1"
      width="30"
      height="30"
      rx="15"
      stroke="#EAAD75"
      strokeWidth="2"
    />
  </svg>
);

export const Callout = ({
  type,
  children,
}: {
  type: "warning" | "note" | "tip";
  children: React.ReactNode;
}) => {
  const Icon = {
    note: NoteIcon,
    warning: WarningIcon,
    tip: TipIcon,
  }[type];
  const text = {
    note: "Note",
    warning: "Warning",
    tip: "Tip",
  }[type];

  return (
    <div
      className={clsx(
        "callout p-24 rounded-[16px] border-2 typography-paragraph-2",
        {
          "border-code-green bg-callout-tip": type == "tip",
          "border-code-blue bg-callout-note": type == "note",
          "border-code-orange bg-callout-warning": type == "warning",
        },
        "dark:bg-footer-dark dark:text-g-400"
      )}
    >
      <header className="typography-paragraph font-bold mb-12 flex items-center space-x-16 dark:text-white">
        <Icon /> <span>{text}</span>
      </header>
      {children}
    </div>
  );
};
