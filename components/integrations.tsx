import cx from "classnames";
import React from "react";

import { AioHttpIcon } from "./icons/aiohttp";
import { ArrowRightIcon } from "./icons/arrow-right";
import { DjangoIcon } from "./icons/django";
import { FastApiIcon } from "./icons/fastapi";
import { FlaskIcon } from "./icons/flask";
import { PydanticIcon } from "./icons/pydantic";
import { SanicIcon } from "./icons/sanic";
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

      <span className="space-x-3 flex justify-center items-center">
        <span>{children}</span>

        <ArrowRightIcon className="stroke-current inline-block mt-4" />
      </span>
    </Link>
  );
};

export const Integrations = () => (
  <div className="my-20 grid gap-4 px-8 lg:px-0 md:grid-cols-2 lg:gap-0 lg:grid-cols-4">
    <Feature href="/docs/integrations/flask" icon={FlaskIcon}>
      <p className="mt-4">Flask</p>
    </Feature>
    <Feature href="/docs/integrations/django" icon={DjangoIcon}>
      <p className="mt-4">Django</p>
    </Feature>
    <Feature href="/docs/integrations/fastapi" icon={FastApiIcon}>
      <p className="mt-4">FastAPI</p>
    </Feature>
    <Feature href="/docs/integrations/sanic" icon={SanicIcon}>
      <p className="mt-4">Sanic</p>
    </Feature>
    <Feature href="/docs/integrations/aiohttp" icon={AioHttpIcon}>
      <p className="mt-4">AIOHTTP</p>
    </Feature>
    <Feature href="/docs/integrations/pydantic" icon={PydanticIcon}>
      <p className="mt-4">Pydantic</p>
    </Feature>
  </div>
);
