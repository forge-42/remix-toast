import { useEffect } from "react";
import { type LinksFunction, type LoaderFunctionArgs, data } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import { ToastContainer, toast as notify } from "react-toastify";
import toastStyles from "react-toastify/ReactToastify.css?url";
import { getToast, unstable_toastMiddleware } from "remix-toast/middleware";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const toast = getToast(context);
  return { toast };
};

export default function App() {
  const { toast } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (toast) {
      notify(toast.message, { type: toast.type });
    }
  }, [toast]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />

        <ToastContainer />
      </body>
    </html>
  );
}

export const unstable_middleware = [unstable_toastMiddleware()];
