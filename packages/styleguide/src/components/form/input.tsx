import { BaseInput } from "./base-input";
import { ErrorLabel, SuccessLabel } from "./labels";
import clsx from "clsx";

export const Input = ({
  name,
  id,
  type = "text",
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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        <BaseInput
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={clsx(className, {
            "border-strawberry": error,
            "border-green": success,
            "pr-48": icon,
          })}
        />

        {icon && (
          <div className="absolute top-0 right-4 h-full flex items-center px-12 text-g-500">
            {icon}
          </div>
        )}
      </div>

      {error && <ErrorLabel>{error}</ErrorLabel>}
      {success && <SuccessLabel>{success}</SuccessLabel>}
    </div>
  );
};
