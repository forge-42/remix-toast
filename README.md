# Remix Toast

![GitHub Repo stars](https://img.shields.io/github/stars/forge-42/remix-toast?style=social)
![npm](https://img.shields.io/npm/v/remix-toast?style=plastic)
![GitHub](https://img.shields.io/github/license/forge-42/remix-toast?style=plastic)
![npm](https://img.shields.io/npm/dy/remix-toast?style=plastic)
![npm](https://img.shields.io/npm/dw/remix-toast?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/forge-42/remix-toast?style=plastic)

<img src="./assets/mascott.png" alt="mascot" width="200" height="200" align="right" />

Simple server-side toast management library for React router v7 / Remix.run!

This library provides you with all the essential utilities that you might need to
show toast notifications to your users. The client side implementation is completely
up to you and you can use any library that you want to show the toasts.

The server function uses @remix-run/server-runtime primitives to create a cookie session so this
library is server agnostic and should work with any server setup.

If you wish to read an in depth explanation of how this works you can find it here:
https://alemtuzlak.hashnode.dev/handling-toasts-in-remix

## Installation

```bash
npm install remix-toast
```

## Remix.run

If you are using Remix.run you can use v1.2.2 of this library or lower. V2 onwards is only react-router v7 compatible.

### Migration guide to react-router v7

If you are using react-router v7 you can use v2.0.0 of this library. The only thing you have to change is rename all the `json` methods to `data` methods, the redirect methods stayed the same. For example:

```diff
- import { jsonWithSuccess } from "remix-toast";
+ import { dataWithSuccess } from "remix-toast";

export const action = () => {
- return jsonWithSuccess({ result: "Data saved successfully" }, "Operation successful! 🎉");
+ return dataWithSuccess({ result: "Data saved successfully" }, "Operation successful! 🎉");
};
```

## Setup

### Server-side (middleware mode)

In order to be able to show toasts anywhere in the app you need to add the following code to your `root.tsx` file.

```tsx
import { getToast, setToast, unstable_toastMiddleware } from "remix-toast/middleware";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  // Extracts the toast from the request
  const toast = getToast(context);
  // pass it to the client side
  return { toast }
}

export const action = async ({ request, context }: Route.ActionArgs) => {
  setToast(context, { message: "hello toast!", type: "success" });
  return null
}

export default function App({ loaderData }: Route.ComponentArgs) {
  const { toast } = loaderData

  useEffect(() => {
   if(toast){
    // Call your toast function here
    alert(toast.message);
   }
  }, [toast])

  return (
    ...
  );
}

// Export the middleware to be used in the app
export const unstable_middleware = [unstable_toastMiddleware()];

```

### Server-side

In order to be able to show toasts anywhere in the app you need to add the following code to your `root.tsx` file.

```tsx
import { getToast } from "remix-toast";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Extracts the toast from the request
  const { toast, headers } = await getToast(request);
  // Important to pass in the headers so the toast is cleared properly
  return data({ toast }, { headers });
}

export default function App({ children }: { children: ReactNode }) {
  const { toast } = useLoaderData<typeof loader>();

  useEffect(() => {
   if(toast){
    // Call your toast function here
    alert(toast.message);
   }
  }, [toast])

  return (
    ...
  );
}
```

### Client-side

After this you can then use any toast notification library you prefer, but here are some examples:

#### react-toastify

```tsx
import { data, type LinksFunction, type LoaderFunctionArgs } from "react-router";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import { useEffect } from "react";
import { getToast } from "remix-toast";
import { ToastContainer, toast as notify } from "react-toastify";
import toastStyles from "react-toastify/ReactToastify.css?url";

// Add the toast stylesheet
export const links: LinksFunction = () => [{ rel: "stylesheet", href: toastStyles }];
// Implemented from above
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return data({ toast }, { headers });
};

export default function App() {
  const { toast } = useLoaderData<typeof loader>();
  // Hook to show the toasts
  useEffect(() => {
    if (toast) {
      // notify on a toast message
      notify(toast.message, { type: toast.type });
    }
  }, [toast]);

  return (
    <html lang="en">
      <head>...</head>
      <body>
        ...
        {/* Add the toast container */}
        <ToastContainer />
      </body>
    </html>
  );
}
```

![react-toastify](./assets/react-toastify.gif)

#### Sonner

```tsx
import { data, type LinksFunction, type LoaderFunctionArgs } from "react-router";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import { useEffect } from "react";
import { getToast } from "remix-toast";
import { Toaster, toast as notify } from "sonner";

// Implemented from above
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return data({ toast }, { headers });
};

export default function App() {
  const { toast } = useLoaderData<typeof loader>();
  // Hook to show the toasts
  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.success(toast.message);
    }
  }, [toast]);

  return (
    <html lang="en">
      <head>...</head>
      <body>
        ...
        {/* Add the toast container */}
        <Toaster />
      </body>
    </html>
  );
}
```

![react-toastify](./assets/sonner.gif)

## Overriding cookie options

You can override the default cookie options by passing in your own options via the `setToastCookieOptions` function.

```tsx
import { setToastCookieOptions } from "remix-toast";

setToastCookieOptions({
  secrets: process.env.NODE_ENV === "production" ? [process.env.SESSION_SECRET] : ["secret"],
});
```

## Creating utility functions with custom sessions

`createToastUtilsWithCustomSession` is a function that allows you to create a custom session for your toasts. This is useful if you want to have different types of toasts for different parts of your app.

```tsx
import { createCookieSessionStorage } from "react-router";
import { createToastUtilsWithCustomSession } from "remix-toast";

const session = createCookieSessionStorage({
  cookie: {
    name: "your-custom-session",
    secrets: ["some-secret"],
  },
});

export const {
  getToast,
  redirectWithToast,
  redirectWithSuccess,
  redirectWithError,
  redirectWithInfo,
  redirectWithWarning,
  dataWithSuccess,
  dataWithError,
  dataWithInfo,
  dataWithWarning,
} = createToastUtilsWithCustomSession(session);
```

## Utilities

## Redirect important notice!

If you want to use `throw` with any of the `redirectWith...` utilities you need to `await` the function call. This is because `redirectWith...` utilities have to generate a cookie and set it on the headers and if that is not awaited the headers won't be set properly and the redirect won't work.

### redirectWithToast

General function that allows you to redirect to a new route and show a toast message.

```tsx
import { redirectWithToast } from "remix-toast";

export const action = () => {
  return redirectWithToast("/login", {
    message: "You need to login to access this page",
    description: "description of toast",
    type: "error",
  });
};
```

### redirectWithSuccess

Redirects to a new route and shows a success toast message.

```tsx
import { redirectWithSuccess } from "remix-toast";

export const action = () => {
  return redirectWithSuccess("/login", "You are logged in!");
  //or with description and message (works for all the other utilities as well)
  return redirectWithSuccess("/login", { message: "You are logged in!", description: "description of toast" });
};
```

### redirectWithError

Redirects to a new route and shows an error toast message.

```tsx
import { redirectWithError } from "remix-toast";

export const action = () => {
  return redirectWithError("/login", "You need to login to access this page");
};
```

### redirectWithInfo

Redirects to a new route and shows an info toast message.

```tsx
import { redirectWithInfo } from "remix-toast";

export const action = () => {
  return redirectWithInfo("/login", "You need to login to access this page");
};
```

### redirectWithWarning

Redirects to a new route and shows a warning toast message.

```tsx
import { redirectWithWarning } from "remix-toast";

export const action = () => {
  return redirectWithWarning("/login", "You need to login to access this page");
};
```

### dataWithSuccess

Display a success toast message without a redirection.

```tsx
import { dataWithSuccess } from "remix-toast";

export const action = () => {
  return dataWithSuccess({ result: "Data saved successfully" }, "Operation successful! 🎉");
  //or with description and message (works for all the other utilities as well)
  return dataWithSuccess(
    { result: "Data saved successfully" },
    { message: "Operation successful! 🎉", description: "description of toast" },
  );
};
```

### dataWithError

Display an error toast message without a redirection.

```tsx
import { dataWithError } from "remix-toast";

export const action = () => {
  return dataWithError(null, "Oops! Something went wrong. Please try again later.");
};
```

### dataWithInfo

Display an info toast message without a redirection.

```tsx
import { dataWithInfo } from "remix-toast";

export const action = () => {
  return dataWithInfo({ info: "Additional information" }, "Your profile has been successfully updated.");
};
```

### dataWithWarning

Display a warning toast message without a redirection.

```tsx
import { dataWithWarning } from "remix-toast";

export const action = () => {
  return dataWithWarning({ warning: "Potential issues" }, "Your session is about to expire.");
};
```

# Thank you

If you wish to support this project you can do so by starring this repository and sharing it with your friends.

Thanks to all the contributors on this project and the support to the community. You guys are awesome!
