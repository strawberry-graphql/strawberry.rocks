import { useState } from "react";
import { useMailchimp } from "../helpers/use-mailchimp";

import { ArrowRightIcon } from "./icons/arrow-right";

const url =
  "https://twitter.us4.list-manage.com/subscribe/post?u=4ad955ae4a0b2d7c67f48323e&amp;id=5e44c190e6";

const Loading = () => <div className="animate-spin">🍓</div>;

const Form = () => {
  const [email, setEmail] = useState("");
  const [mailchimp, subscribe] = useMailchimp({
    url,
  });
  const { loading, error, data } = mailchimp;

  const canSubmit = email.trim() !== "" && !loading;

  if (data && data.result === "success") {
    return <p className="font-bold text-xl">🎉 Thanks for subscribing! 🎉</p>;
  }

  if (error) {
    return (
      <p
        className="font-bold text-xl"
        dangerouslySetInnerHTML={{ __html: error }}
      />
    );
  }

  return (
    <form
      className="h-14 flex bg-white dark:bg-gray-800 rounded-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) {
          subscribe({ EMAIL: email });
        }
      }}
    >
      <input
        className="w-full h-14 px-8 border-none rounded-full outline-none text-black dark:bg-gray-800 dark:text-white"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="my@email.com"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="flex rounded-full items-center justify-center self-center w-14 h-14 p-4 bg-red-300 dark:bg-red-700"
      >
        {loading ? (
          <Loading />
        ) : (
          <ArrowRightIcon className="text-red-500 dark:text-white stroke-current" />
        )}
      </button>
    </form>
  );
};

export const NewsletterSection = () => (
  <div className="p-10 bg-red-500 text-white relative rounded-r-full">
    <div className="bg-black absolute inset-y-2/4 bottom-0 left-0 right-0 -z-10" />
    <div className="mx-auto max-w-md text-center">
      <h1 className="font-bold text-2xl mb-6">Newsletter 💌</h1>
      <p className="mb-8">
        Do you want to receive the latest updates on Strawberry? Subscribe to
        our newsletter!
      </p>

      <Form />
    </div>
  </div>
);
