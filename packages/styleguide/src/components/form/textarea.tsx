import { ErrorLabel, SuccessLabel } from "./labels";
import clsx from "clsx";

export const Textarea = ({
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
}: {
  name?: string;
  id?: string;
  type?: "text" | "email" | "search" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  success?: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={clsx(
          "border-[1.5px] border-g-100 dark:border-g-900 rounded-[16px] px-24 py-12 typography-paragraph-2",
          "placeholder:text-g-500 text-g-700 dark:text-g-50 disabled:text-g-400",
          "bg-transparent input-border outline-none resize-none max-w-lg",
          "w-full",
          {
            "border-strawberry": error,
            "border-green": success,
            "pr-48": icon,
          },
          className
        )}
      />

      {error && <ErrorLabel>{error}</ErrorLabel>}
      {success && <SuccessLabel>{success}</SuccessLabel>}
    </div>
  );
};
