"use client";

import { useMailchimp } from "../../hooks/use-mailchimp";
import { Button } from "../button/button";
import { Input } from "../form/input";
import { PlusIcon } from "../icons/plus";
import { UserIcon } from "../icons/user";
import { Heading } from "../typography/heading";
import { useState } from "react";

const url =
  "https://twitter.us4.list-manage.com/subscribe/post?u=4ad955ae4a0b2d7c67f48323e&amp;id=5e44c190e6";

export const NewsletterForm = () => {
  const [{ loading, error: mailchimpError, data }, subscribe] = useMailchimp({
    url,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");

    if (email && !loading) {
      subscribe({ EMAIL: email.toString() });
    }
  };

  const register = data?.result === "success";
  const error = mailchimpError || data?.result === "error";

  return (
    <form onSubmit={handleSubmit}>
      <Heading level={3} className="mb-24">
        Join our newsletter
      </Heading>

      {register ? (
        <p className="py-12 typography-paragraph-2">
          Awesome! You&apos;re now subscribed to our newsletter 🎉 🍓
        </p>
      ) : (
        <div className="flex items-center space-x-16">
          <Input
            placeholder="Type your email address"
            name="email"
            type="email"
            required
            className="sm:w-[280px]"
            icon={<UserIcon />}
          />

          <Button
            type="submit"
            as="button"
            disabled={loading}
            className="hidden md:block relative"
          >
            Subscribe
            {loading && (
              <span className="animate-bounce absolute flex justify-center items-center inset-0">
                🍓
              </span>
            )}
          </Button>
          <Button
            type="submit"
            as="button"
            disabled={loading}
            className="md:hidden relative"
            variant="circle"
          >
            <PlusIcon />
            {loading && (
              <span className="animate-bounce absolute flex justify-center items-center inset-0">
                🍓
              </span>
            )}
          </Button>
        </div>
      )}
      {error && (
        <p className="text-strawberry pl-24 mt-8 text-sm">
          Something went wrong, please try again later.
        </p>
      )}
    </form>
  );
};
