import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Please select a category"),
  campus_id: z.string().uuid("Please select a campus"),
  images: z.array(z.string()).min(1, "At least one image is required").max(4),
});

export type ProductFormValues = z.infer<typeof productSchema>;
