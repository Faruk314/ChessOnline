import { LoginSchema, RegisterSchema } from "../client/schemas/auth";
import { z } from "zod";

type LoginInput = z.infer<typeof LoginSchema>;

type RegisterInput = z.infer<typeof RegisterSchema>;

export type { LoginInput, RegisterInput };
