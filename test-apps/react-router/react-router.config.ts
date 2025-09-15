import type { Config } from "@react-router/dev/config";

declare module "react-router" {
  interface Future {
    v8_middleware: true; // 👈 Enable middleware types
  }
}

export default {
  future: {
    v8_middleware: true, // 👈 Enable middleware
  },
} satisfies Config;
