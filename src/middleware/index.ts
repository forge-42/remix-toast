import {
  type SessionStorage,
  type unstable_MiddlewareFunction,
  type unstable_RouterContextProvider,
  unstable_createContext,
} from "react-router";
import { type ToastMessage, getToast as getToastPrimitive } from "..";
import { FLASH_SESSION } from "../schema";
import { sessionStorage } from "../session";

const toastContext = unstable_createContext<ToastMessage | null>(null);
const sessionToastContext = unstable_createContext<ToastMessage | null>(null);

export function unstable_toastMiddleware(props?: { customSession?: SessionStorage }): unstable_MiddlewareFunction {
  const { customSession } = props || {};
  const sessionToUse = customSession || sessionStorage;
  return async function toastMiddleware({ request, context }, next) {
    const { toast, headers } = await getToastPrimitive(request, customSession);

    context.set(toastContext, toast ?? null);
    // Call the next middleware or route handler
    const res = await next();

    if (res instanceof Response && toast) {
      res.headers.append("Set-Cookie", headers.get("Set-Cookie") ?? "");
    }
    const toastToSet = context.get(sessionToastContext);

    if (res instanceof Response && toastToSet) {
      const session = await sessionToUse.getSession(request.headers.get("Cookie"));
      session.flash(FLASH_SESSION, { toast: toastToSet });
      res.headers.append("Set-Cookie", await sessionToUse.commitSession(session));
    }

    return res;
  };
}

export const setToast = (context: unstable_RouterContextProvider, toast: ToastMessage | null) => {
  context.set(sessionToastContext, toast);
};

export const getToast = (context: unstable_RouterContextProvider) => context.get(toastContext);
