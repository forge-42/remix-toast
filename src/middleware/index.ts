import {
  type SessionStorage,
  type unstable_MiddlewareFunction,
  type unstable_RouterContextProvider,
  unstable_createContext,
} from "react-router";
import { type ToastMessage, getToast as getToastPrimitive } from "..";

const toastContext = unstable_createContext<ToastMessage | null>(null);

export function unstable_toastMiddleware(props?: { customSession?: SessionStorage }): unstable_MiddlewareFunction {
  const { customSession } = props || {};

  return async function toastMiddleware({ request, context }, next) {
    const { toast, headers } = await getToastPrimitive(request, customSession);
    context.set(toastContext, toast ?? null);
    const res = await next();
    if (res instanceof Response && toast) {
      res.headers.append("Set-Cookie", headers.get("Set-Cookie") || "");
    }
    return res;
  };
}

export const getToast = (context: unstable_RouterContextProvider) => context.get(toastContext);
