import { z } from "zod";

export const NOTIFICATION_OPTIONS = [
  {
    name: "productUpdates",
    label: "Product updates",
    description: "New features, tips, and release notes.",
  },
  {
    name: "accountActivity",
    label: "Account activity",
    description: "Sign-ins, password changes, and security alerts.",
  },
  {
    name: "marketing",
    label: "Marketing emails",
    description: "Occasional offers and newsletters. Optional.",
  },
];

export const userSettingsSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(1, "Name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer.")
    .regex(
      /^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u,
      "Use letters, spaces, apostrophes, or hyphens only.",
    ),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .max(254, "Email must be 254 characters or fewer.")
    .email("Enter a valid email address."),
  notifications: z.object({
    productUpdates: z.boolean(),
    accountActivity: z.boolean(),
    marketing: z.boolean(),
  }),
});

export const defaultUserSettings = {
  name: "",
  email: "",
  notifications: {
    productUpdates: true,
    accountActivity: true,
    marketing: false,
  },
};
