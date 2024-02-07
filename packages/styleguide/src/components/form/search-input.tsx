import { SearchIcon } from "../icons/search";
import { ErrorLabel, SuccessLabel } from "./labels";
import clsx from "clsx";

export const SearchInput = ({
  name,
  id,
  placeholder,
  value,
  onChange,
  onClick,
  error,
  required,
  className,
  success,
  onFocus,
}: {
  name?: string;
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  success?: string;
  onFocus?: (e: any) => void;
}) => {
  return (
    <div className={className}>
      <div className="relative inline-block w-full">
        <div
          onClick={onClick}
          className={clsx(
            "border-[1.5px] border-g-100 dark:border-g-900 rounded-[30px] px-24 py-12 typography-paragraph-2",
            "text-g-500 dark:text-g-700",
            "bg-transparent input-border outline-none",
            "w-full cursor-pointer pl-48",
            {
              "border-strawberry": error,
              "border-green": success,
            }
          )}
        >
          {placeholder}

          <div className="absolute top-0 left-4 h-full flex items-center px-12 text-g-500">
            <SearchIcon />
          </div>
        </div>
      </div>

      {error && <ErrorLabel>{error}</ErrorLabel>}
      {success && <SuccessLabel>{success}</SuccessLabel>}
    </div>
  );
};
