import React from "react";

import { AioHttpIcon } from "./icons/aiohttp";
import { DjangoIcon } from "./icons/django";
import { FastApiIcon } from "./icons/fastapi";
import { FlaskIcon } from "./icons/flask";
import { SanicIcon } from "./icons/sanic";

export function Integrations() {
  return (
    <div>
      <p className="mt-12 mb-6 font-bold text-xl text-center">
        Integrations for all the most popular Python development frameworks
      </p>{" "}
      <p>
        Discover how to integrate Strawberry GraphQL with the most used
        frameworks in Python for web development
      </p>
      <div className="grid-cards my-20 grid gap-4 px-8 lg:px-0 md:grid-cols-2 lg:gap-0 lg:grid-cols-4">
        <div className="box-frameworks font-mono overflow-x-auto border-2 border-red-500 p-6 bg-white dark:text-white dark:bg-gray-800 border-4 language-python">
          <a href="https://strawberry.rocks/docs/integrations/flask">
            <FlaskIcon />
            <h1 className=" txt-hover-framework">Flask</h1>
          </a>
        </div>
        <div className="box-frameworks font-mono overflow-x-auto border-2 border-red-500 p-6 bg-white dark:text-white dark:bg-gray-800 border-4 language-python">
          <a href="https://strawberry.rocks/docs/integrations/django">
            <DjangoIcon />
            <h1 className="mt-3 txt-hover-framework">Django</h1>
          </a>
        </div>
        <div className="box-frameworks font-mono overflow-x-auto border-2 border-red-500 p-6 bg-white dark:text-white dark:bg-gray-800 border-4 language-python">
          <a href="https://strawberry.rocks/docs/integrations/fastapi">
            <FastApiIcon />
            <h1 className="mt-3 txt-hover-framework">FastAPI</h1>
          </a>
        </div>
        <a href="/docs/integrations/sanic">
          <div className="box-frameworks font-mono overflow-x-auto border-2 border-red-500 p-6 bg-white dark:text-white dark:bg-gray-800 border-4 language-python">
            <SanicIcon />
            <h1 className="mt-3 txt-hover-framework">Sanic</h1>
          </div>
        </a>
        <div className="box-frameworks font-mono overflow-x-auto border-2 border-red-500 p-6 bg-white dark:text-white dark:bg-gray-800 border-4">
          <a href="https://strawberry.rocks/docs/integrations/aiohttp">
            <AioHttpIcon />
            <h1 className="mt-3 txt-hover-framework">AIOHTTP</h1>
          </a>
        </div>
      </div>
    </div>
  );
}
