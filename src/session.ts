import { type SessionIdStorageStrategy, createCookieSessionStorage } from "react-router";

export type ToastCookieOptions = Partial<SessionIdStorageStrategy["cookie"]>;

export const toastCookieOptions = {
  name: "toast-session",
  sameSite: "lax",
  path: "/",
  httpOnly: true,
  secrets: ["s3Cr3t"],
} satisfies ToastCookieOptions;

export const sessionStorage = createCookieSessionStorage({
  cookie: toastCookieOptions,
});
