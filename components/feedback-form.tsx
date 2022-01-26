import { useState } from "react";

import { useToggle } from "~/helpers/use-toggle";

const sendFeedback = async ({
  sentiment,
  feedback,
  url,
}: {
  sentiment: string;
  feedback: string;
  url: string;
}) => {
  const request = await fetch("https://api.strawberry.rocks/graphql", {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query:
        "mutation ($input: SendFeedbackInput!) { sendFeedback(input: $input) }",
      variables: { input: { feedback, sentiment, url } },
    }),
  });

  const response = await request.json();

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }
};

const Success = () => (
  <div>
    <h1 className="font-bold text-3xl text-center mb-2">Thank you!</h1>

    <div className="md:max-w-2xl m-auto">
      <div className="aspect-w-4 aspect-h-3 relative">
        <iframe
          src="https://giphy.com/embed/ddj3fbm2jsDCw"
          width="100%"
          height="100%"
          frameBorder="0"
          className="absolute"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
);

export const FeedbackForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [textareaVisibile, _, setTextareaVisibile] = useToggle(false);
  const [{ loading, error, success }, setApi] = useState({
    loading: false,
    error: false,
    success: false,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = Object.fromEntries(new FormData(form));
    data.url = window.location.href;

    // TODO: send api request
    setApi({ loading: true, error: false, success: false });

    try {
      await sendFeedback(
        data as { feedback: string; sentiment: string; url: string }
      );
      setApi({ loading: false, error: false, success: true });
    } catch (e) {
      console.error(e);
      setApi({ loading: false, error: true, success: false });
    }
  };

  if (success) {
    return <Success />;
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h1 className="font-bold text-center mb-2">
        Was this helpful? How could we improve it?
      </h1>

      <form onChange={() => setTextareaVisibile(true)} onSubmit={submit}>
        <nav className="list-none flex justify-center space-x-4 mb-4">
          <li>
            <label className="cursor-pointer">
              <input
                name="sentiment"
                className="hidden peer"
                type="radio"
                title="Not at all"
                value="😭"
              />
              <span className="peer-checked:border-b-4 border-blue-600">
                😭
              </span>
            </label>
          </li>
          <li>
            <label className="cursor-pointer">
              <input
                name="sentiment"
                className="hidden peer"
                type="radio"
                title="It is a bit confusing"
                value="😕"
              />
              <span className="peer-checked:border-b-4 border-blue-600">
                😕
              </span>
            </label>
          </li>
          <li>
            <label className="cursor-pointer">
              <input
                name="sentiment"
                className="hidden peer"
                type="radio"
                title="It was good"
                value="😃"
              />
              <span className="peer-checked:border-b-4 border-blue-600">
                😃
              </span>
            </label>
          </li>
          <li>
            <label className="cursor-pointer">
              <input
                name="sentiment"
                className="hidden peer"
                type="radio"
                title="Yes, it is perfect"
                value="🤩"
              />
              <span className="peer-checked:border-b-4 border-blue-600">
                🤩
              </span>
            </label>
          </li>
        </nav>

        {textareaVisibile && (
          <div className="md:max-w-2xl m-auto">
            <div className="mb-4">
              <label htmlFor="feedback" className="sr-only">
                Feedback
              </label>

              <textarea
                id="feedback"
                name="feedback"
                className="border w-full p-4 dark:text-white dark:bg-gray-700 "
                required
                placeholder="Feedback..."
              ></textarea>
            </div>

            {error && (
              <p className="text-red-500">
                Something went wrong. Please try again.
              </p>
            )}
            <div className="flex justify-end">
              <button
                disabled={loading}
                className="border-2 border-blue-600 p-4 hover:bg-gray-50 text-blue-600 flex items-center justify-center dark:border-blue-300 dark:text-blue-300 dark:hover:bg-blue-900 disabled:border-gray-500 disabled:text-gray-500"
              >
                {loading ? "Sending feedback" : "Send"}
                {loading && (
                  <span className="inline-block ml-2 animate-bounce">🍓</span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
