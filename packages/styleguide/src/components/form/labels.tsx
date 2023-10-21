import { AlertIcon } from "../icons/alert";
import { CheckIcon } from "../icons/check";
import { Caption } from "../typography/caption";

export const ErrorLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-8 text-strawberry flex items-center">
    <AlertIcon className="w-12 h-12 mr-8" />
    <Caption>{children}</Caption>
  </div>
);

export const SuccessLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-8 text-green flex items-center">
    <CheckIcon className="w-[10px] h-[7px] mr-8" />
    <Caption>{children}</Caption>
  </div>
);
