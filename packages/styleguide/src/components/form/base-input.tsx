import clsx from "clsx";

export const BaseInput = ({
  type,
  id,
  placeholder,
  value,
  name,
  onChange,
  onClick,
  required,
  disabled,
  className,
  onFocus,
}: {
  name?: string;
  id?: string;
  type: "text" | "email" | "search" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  success?: string;
  onFocus?: (e: any) => void;
}) => (
  <input
    type={type}
    id={id}
    placeholder={placeholder}
    value={value}
    name={name}
    onChange={onChange}
    required={required}
    disabled={disabled}
    onFocus={onFocus}
    onClick={onClick}
    className={clsx(
      "border-[1.5px] border-g-100 dark:border-g-900 rounded-[30px] px-24 py-12 typography-paragraph-2",
      "placeholder:text-g-500 text-g-700 dark:text-g-50 disabled:text-g-400",
      "bg-transparent input-border outline-none",
      "w-full",
      className
    )}
  />
);
