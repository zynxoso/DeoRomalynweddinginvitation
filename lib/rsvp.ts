import { z } from "zod";
export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100, "Please use 100 characters or fewer."),
  attendance: z.enum(["accept", "decline"], { error: "Please choose whether you can join us." }),
  message: z.string().trim().max(1000, "Please keep your message under 1,000 characters.")
});
export type RsvpResponse = z.infer<typeof rsvpSchema>;
