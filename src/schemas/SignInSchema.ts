import { z } from "zod";
import { UsernameSchema } from "./SignUpSchema";

export const SignUpSchema = z.object({
  identifier: z.union([UsernameSchema, z.string().email()]),
  password: z
    .string()
    .min(2, "password should have at least 2 characters")
    .max(20, "password should have at most 10 characters"),
});
