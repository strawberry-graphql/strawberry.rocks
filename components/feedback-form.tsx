import { useToggle } from "~/helpers/use-toggle";

export const FeedbackForm = () => {
  const [textareaVisibile, _, setTextareaVisibile] = useToggle(false);

  return (
    <div className="mt-8 border-t pt-8">
      <h1 className="font-bold text-center mb-2">Was this helpful?</h1>

      <form onChange={() => setTextareaVisibile(true)}>
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
                className="border w-full p-4 dark:text-white dark:bg-gray-700 "
                required
                placeholder="Feedback..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button className="border-2 border-blue-600 p-4 hover:bg-gray-50 text-blue-600 flex items-center justify-center dark:border-blue-300 dark:text-blue-300 dark:hover:bg-blue-900">
                Send
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
