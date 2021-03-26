import cx from "classnames";

import { ArrowRightIcon } from "./icons/arrow-right";
import { AsyncIcon } from "./icons/async";
import { PythonicIcon } from "./icons/pythonic";
import { ServerIcon } from "./icons/server";
import { TypingIcon } from "./icons/typing";
import { Link } from "./link";

type FeatureProps = {
  icon?: React.FC<any>;
  href: string;
  children: React.ReactNode;
};

const Feature = ({ icon: Icon, children, ...props }: FeatureProps) => {
  return (
    <Link
      {...props}
      className={cx(
        "bg-red-300 even:bg-red-200 dark:bg-red-500 even:dark:bg-red-700",
        "p-8 text-red-500 dark:text-white transition-transform",
        "flex justify-center items-center transform",
        "lg:hover:translate-y-4"
      )}
    >
      {Icon && <Icon className="fill-current block my-4 h-36 mx-auto" />}

      <span className="flex space-x-3 items-center">
        <span>{children}</span>

        <ArrowRightIcon className="stroke-current inline-block" />
      </span>
    </Link>
  );
};

export const Features = () => (
  <div className="my-20 grid gap-4 px-8 lg:px-0 md:grid-cols-2 lg:gap-0 lg:grid-cols-4">
    <Feature href="/docs/concepts/async" icon={AsyncIcon}>
      Async
    </Feature>
    <Feature href="/docs/features/server" icon={ServerIcon}>
      Built-in server
    </Feature>
    <Feature href="/docs/concepts/typings" icon={TypingIcon}>
      Typings
    </Feature>
    <Feature href="/docs/general/why" icon={PythonicIcon}>
      Philosophy
    </Feature>
  </div>
);
