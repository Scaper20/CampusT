import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).refine((val) => {
    const domain = val.split('@')[1];
    return domain?.endsWith('.edu.ng') || domain?.includes('calebuniversity.edu.ng');
  }, { message: "Only university emails (.edu.ng) are allowed" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  campus_id: z.string().uuid({ message: "Please select a campus" }),
});
