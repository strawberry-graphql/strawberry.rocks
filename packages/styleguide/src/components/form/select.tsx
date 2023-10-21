import { ArrowUpIcon } from "../icons/arrow-up";
import { ErrorLabel, SuccessLabel } from "./labels";
import clsx from "clsx";

export const Select = ({
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  icon,
  success,
  className,
  options,
}: {
  name?: string;
  id?: string;
  options: { label: string; value: string; disabled?: boolean }[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  success?: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div>
      <div className="relative inline-block">
        <select
          id={id}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          required={required}
          disabled={disabled}
          // TODO: maybe base class for this and inputs?
          className={clsx(
            "border-[1.5px] border-g-100 dark:border-g-900 rounded-[30px] px-24 py-12 typography-paragraph-2",
            "placeholder:text-g-500 text-g-700 dark:text-g-50 disabled:text-g-400",
            "bg-transparent input-border outline-none w-full appearance-none pr-40",
            {
              "border-strawberry": error,
              "border-green": success,
              "pl-48": icon,
            }
          )}
        >
          {placeholder && (
            <option value="" disabled selected={!value}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {icon && (
          <div className="absolute top-0 left-4 h-full flex items-center px-12 text-g-500">
            {icon}
          </div>
        )}

        <div className="absolute top-0 right-4 h-full px-12 pointer-events-none">
          <ArrowUpIcon className="text-g-500 dark:text-g-700 rotate-180 h-full" />
        </div>
      </div>

      {error && <ErrorLabel>{error}</ErrorLabel>}
      {success && <SuccessLabel>{success}</SuccessLabel>}
    </div>
  );
};
