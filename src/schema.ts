import { z } from "zod";

export const toastMessageSchema = z
  .object({
    message: z.string(),
    description: z.string().optional(),
    duration: z.number().int().positive().optional(),
    type: z.custom<"info" | "success" | "error" | "warning">(),
  })
  .passthrough();

const toastMessageWithoutTypeSchema = z
  .object({
    message: z.string(),
    description: z.string().optional(),
    duration: z.number().int().positive().optional(),
  })
  .passthrough();

export const flashSessionValuesSchema = z.object({
  toast: toastMessageSchema.optional(),
});

export type ToastMessage = z.infer<typeof toastMessageSchema> & {};
export type ToastMessageWithoutType = z.infer<typeof toastMessageWithoutTypeSchema> & {};
export type FlashSessionValues = z.infer<typeof flashSessionValuesSchema>;
