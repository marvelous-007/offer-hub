import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),

  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),

  email: z.string().min(1, {
    message: "Email is required.",
  }),

  wallet: z.string().min(1, {
    message: "Wallet address is required.",
  }),
});
