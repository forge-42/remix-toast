import type { MetaFunction } from "react-router";
import { Link, useSubmit } from "react-router";
import { dataWithError, dataWithToast, redirectWithError, redirectWithToast } from "remix-toast";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};
export const action = () => {
  dataWithToast("/test", { message: "this is a message", type: "success" });
  redirectWithToast("/test", { message: "this is a message", type: "success" });
  return redirectWithError("/test", { message: "t", description: "" });
};

export default function Index() {
  const submit = useSubmit();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={() => submit("/", { method: "post" })}>Click Me</button>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
        <li>
          <Link to="/without-redirection">Test without redirection</Link>
        </li>
      </ul>
    </div>
  );
}
