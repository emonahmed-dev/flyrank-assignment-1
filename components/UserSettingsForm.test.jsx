import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import UserSettingsForm from "@/components/UserSettingsForm";
import { userSettingsSchema } from "@/lib/userSettingsSchema";

function renderForm(props) {
  return render(<UserSettingsForm {...props} />);
}

describe("userSettingsSchema", () => {
  it("accepts a complete valid payload and normalizes email", () => {
    const result = userSettingsSchema.safeParse({
      name: "  Ada Lovelace ",
      email: "  ADA@Example.COM ",
      notifications: {
        productUpdates: false,
        accountActivity: true,
        marketing: true,
      },
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      notifications: {
        productUpdates: false,
        accountActivity: true,
        marketing: true,
      },
    });
  });

  it("rejects whitespace-only names", () => {
    const result = userSettingsSchema.safeParse({
      name: "   ",
      email: "ada@example.com",
      notifications: {
        productUpdates: true,
        accountActivity: true,
        marketing: false,
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name?.[0]).toBe(
        "Name is required.",
      );
    }
  });

  it("rejects names that are too short, too long, or include numbers", () => {
    const base = {
      email: "ada@example.com",
      notifications: {
        productUpdates: true,
        accountActivity: true,
        marketing: false,
      },
    };

    expect(userSettingsSchema.safeParse({ ...base, name: "A" }).success).toBe(
      false,
    );
    expect(
      userSettingsSchema.safeParse({ ...base, name: "A".repeat(81) }).success,
    ).toBe(false);
    expect(
      userSettingsSchema.safeParse({ ...base, name: "Ada 2" }).success,
    ).toBe(false);
  });

  it("rejects missing and malformed emails", () => {
    const base = {
      name: "Ada Lovelace",
      notifications: {
        productUpdates: true,
        accountActivity: true,
        marketing: false,
      },
    };

    expect(userSettingsSchema.safeParse({ ...base, email: "" }).success).toBe(
      false,
    );
    expect(
      userSettingsSchema.safeParse({ ...base, email: "not-an-email" }).success,
    ).toBe(false);
    expect(
      userSettingsSchema.safeParse({ ...base, email: "ada@" }).success,
    ).toBe(false);
  });

  it("allows turning every notification off", () => {
    const result = userSettingsSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      notifications: {
        productUpdates: false,
        accountActivity: false,
        marketing: false,
      },
    });

    expect(result.success).toBe(true);
  });
});

describe("UserSettingsForm", () => {
  it("shows validation errors when required fields are empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/name/i)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("validates email format and name characters", async () => {
    const user = userEvent.setup();
    renderForm({ onSubmit: vi.fn() });

    await user.type(screen.getByLabelText(/name/i), "Ada 3");
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(
      await screen.findByText(
        "Use letters, spaces, apostrophes, or hyphens only.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("submits trimmed values and notification preferences", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/name/i), "  Ada Lovelace ");
    await user.type(screen.getByLabelText(/email/i), "  ADA@Example.COM ");
    await user.click(screen.getByLabelText(/marketing emails/i));
    await user.click(screen.getByLabelText(/product updates/i));
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      notifications: {
        productUpdates: false,
        accountActivity: true,
        marketing: true,
      },
    });

    expect(
      await screen.findByRole("status"),
    ).toHaveTextContent("Settings saved");
  });

  it("shows a loading state and blocks repeat submits", async () => {
    const user = userEvent.setup();
    let resolveSave;
    const onSubmit = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const savingButton = await screen.findByRole("button", { name: /saving/i });
    expect(savingButton).toBeDisabled();
    expect(screen.getByRole("form", { name: /user settings form/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByLabelText(/name/i)).toBeDisabled();

    await user.click(savingButton);
    expect(onSubmit).toHaveBeenCalledTimes(1);

    resolveSave();
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("surfaces a save error without leaving a success message", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network unavailable"));
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Network unavailable",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
