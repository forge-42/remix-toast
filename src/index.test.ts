import { createCookieSessionStorage } from "react-router";
import { createToastUtilsWithCustomSession, getToast, replaceWithSuccess } from "./index";

describe("replaceWith* utilities", () => {
  it("marks replacements and flashes toast data", async () => {
    const response = await replaceWithSuccess("/next", "Saved!");

    expect(response.headers.get("Location")).toBe("/next");
    expect(response.headers.get("X-Remix-Replace")).toBe("true");

    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toBeTruthy();

    const request = new Request("http://example.com");
    request.headers.set("Cookie", setCookie?.split(";")[0] ?? "");
    const { toast } = await getToast(request);

    expect(toast).toEqual({ message: "Saved!", type: "success" });
  });

  it("uses a provided custom session storage", async () => {
    const customSession = createCookieSessionStorage({
      cookie: {
        name: "custom-toast-session",
        secrets: ["custom-secret"],
      },
    });

    const { replaceWithError, getToast: getToastFromCustomSession } =
      createToastUtilsWithCustomSession(customSession);

    const response = await replaceWithError("/oops", "Something went wrong");
    const setCookie = response.headers.get("Set-Cookie");

    expect(setCookie).toContain("custom-toast-session");

    const request = new Request("http://example.com");
    request.headers.set("Cookie", setCookie?.split(";")[0] ?? "");

    const { toast } = await getToastFromCustomSession(request);

    expect(toast).toEqual({ message: "Something went wrong", type: "error" });
  });
});
