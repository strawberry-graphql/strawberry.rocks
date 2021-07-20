import React from "react";

import { Header } from "~/components/header";
import { Link } from "~/components/link";
import { Logo } from "~/components/logo";

function Page404() {
  return (
    <div>
      <Header showLogo={false} />
      <div className="place-content-center grid h-screen">
        <div className="flex justify-center items-center mb-4">
          <Logo height="250px" width="250px" className="float-animation" />
        </div>
        <div className="flex justify-center items-center">
          <h1 className="text-3xl lg:text-5xl lg:leading-relaxed from-red-500 to-red-500 python">
            Page not found
          </h1>
        </div>
          <p className="text-2xl text-center">
            We couldn't find what you were looking for.
          </p>
        <div className="flex justify-center items-center mt-4">
          <Link
            className="no-underline bg-red-500 p-2 text-white hover:bg-red-300 hover:text-black"
            href="/"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page404;
