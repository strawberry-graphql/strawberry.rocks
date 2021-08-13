export const FeedbackForm = () => (
  <div className="border p-8 mt-8">
    <h1 className="font-bold">Was this helpful?</h1>

    <form>
      <nav className="list-none flex">
        <li>
          <label>
            <input
              name="sentiment"
              className="hidden peer"
              type="radio"
              title="Not at all"
              value="😭"
            />
            <span className="peer-checked:hidden">😭</span>
          </label>
        </li>
        <li>
          <label>
            <input
              name="sentiment"
              className="hidden peer"
              type="radio"
              title="It is a bit confusing"
              value="😕"
            />
            <span className="peer-checked:hidden">😕</span>
          </label>
        </li>
        <li>
          <label>
            <input
              name="sentiment"
              className="hidden peer"
              type="radio"
              title="It was good"
              value="😃"
            />
            <span className="peer-checked:hidden">😃</span>
          </label>
        </li>
        <li>
          <label>
            <input
              name="sentiment"
              className="hidden peer"
              type="radio"
              title="Yes, it is perfect"
              value="🤩"
            />
            <span className="peer-checked:hidden">🤩</span>
          </label>
        </li>
      </nav>

      <textarea className="border w-full"></textarea>
    </form>
  </div>
);
